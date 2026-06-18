import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const rows = await sql`SELECT * FROM quote_requests ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/quotes]', err);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tourId, tourTitle, name, email, phone, travelDate, groupSize, message } = body;
    if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO quote_requests (id, tour_id, tour_title, name, email, phone, travel_date, group_size, message)
      VALUES (${id}, ${tourId || null}, ${tourTitle || ''}, ${name}, ${email},
              ${phone || ''}, ${travelDate || ''}, ${parseInt(groupSize) || 1}, ${message || ''})
    `;

    // Send email via Gmail SMTP if configured
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const gmailTo = process.env.GMAIL_TO || gmailUser;
    if (gmailUser && gmailPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass },
        });
        await transporter.sendMail({
          from: `"Elbo Tours" <${gmailUser}>`,
          to: gmailTo,
          replyTo: email,
          subject: `New Quote Request - ${tourTitle || 'General Inquiry'}`,
          html: `
            <h2>New Quote Request</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Tour</td><td style="padding:8px;border:1px solid #ddd">${tourTitle || 'General'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${phone || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Travel Date</td><td style="padding:8px;border:1px solid #ddd">${travelDate || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Group Size</td><td style="padding:8px;border:1px solid #ddd">${groupSize || 1}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message || '-'}</td></tr>
            </table>
          `,
        });
      } catch (mailErr) {
        console.error('[Gmail]', mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/quotes]', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status } = await req.json();
    await sql`UPDATE quote_requests SET status=${status} WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
