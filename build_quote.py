import os

# 1. API route for quote requests
os.makedirs(r"E:\projects\Elbo-Tours\app\api\quotes", exist_ok=True)
with open(r"E:\projects\Elbo-Tours\app\api\quotes\route.ts", "w", encoding="utf-8") as f:
    f.write("""import { NextRequest, NextResponse } from 'next/server';
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
""")
print("OK: /api/quotes/route.ts created")

# 2. QuoteModal component
os.makedirs(r"E:\projects\Elbo-Tours\components\tours", exist_ok=True)
with open(r"E:\projects\Elbo-Tours\components\tours\QuoteModal.tsx", "w", encoding="utf-8") as f:
    f.write("""'use client';
import { useState } from 'react';

interface Props {
  tourId: string;
  tourTitle: string;
  onClose: () => void;
}

export default function QuoteModal({ tourId, tourTitle, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', travelDate: '', groupSize: '2', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.name || !form.email) { setErr('Name and email are required'); return; }
    setSending(true); setErr('');
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourId, tourTitle, ...form }),
    });
    if (res.ok) { setSent(true); }
    else { setErr('Failed to send. Please try WhatsApp instead.'); }
    setSending(false);
  }

  const inp: React.CSSProperties = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e8e0d0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>x</button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>checkmark</div>
            <h3 style={{ color: '#1a0d00', marginBottom: '0.5rem' }}>Request Sent!</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>We will get back to you within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop: '1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 600 }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ margin: '0 0 0.25rem', color: '#1a0d00', fontSize: '1.2rem' }}>Request a Quote</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#888', fontSize: '0.85rem' }}>{tourTitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Full Name *</label>
                <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Email *</label>
                <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <label style={lbl}>Phone / WhatsApp</label>
                <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+212..." />
              </div>
              <div>
                <label style={lbl}>Group Size</label>
                <input style={inp} type="number" min="1" value={form.groupSize} onChange={e => set('groupSize', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Travel Date</label>
                <input style={inp} type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Message (optional)</label>
                <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Any special requests..." />
              </div>
            </div>
            {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={submit} disabled={sending} style={{ flex: 1, background: '#C8960C', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                {sending ? 'Sending...' : 'Send Request'}
              </button>
              <a href={"https://wa.me/212665889258?text=" + encodeURIComponent("Hi! I am interested in " + tourTitle)}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: '#25D366', color: '#fff', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, fontSize: '0.95rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
""")
print("OK: QuoteModal component created")
