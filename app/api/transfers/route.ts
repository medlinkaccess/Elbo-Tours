import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || 'en';
  try {
    const rows = await sql`
      SELECT
        t.id, t.slug, t.type, t."fromLocation", t."toLocation",
        t."priceFrom", t."imageUrl" AS image, t.active,
        t."flightTracking", t."meetAndGreet", t.featured,
        COALESCE(
          (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = ${locale} LIMIT 1),
          (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'en' LIMIT 1)
        ) AS title,
        COALESCE(
          (SELECT tt.description FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = ${locale} LIMIT 1),
          (SELECT tt.description FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'en' LIMIT 1)
        ) AS description,
        (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'en' LIMIT 1) AS "titleEn",
        (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'fr' LIMIT 1) AS "titleFr"
      FROM transfers t
      WHERE t.active = true
      ORDER BY t."sortOrder" ASC, t."createdAt" DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/transfers]', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const id = randomUUID();
    const slug = (body.title || 'transfer')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + id.slice(0, 6);
    const transferType = body.type === 'CITY_TO_CITY' ? 'CITY_TO_CITY' : 'AIRPORT';
    await sql`
      INSERT INTO transfers (id, slug, type, "fromLocation", "toLocation", "priceFrom", "imageUrl", active, "createdAt", "updatedAt")
      VALUES (
        ${id}, ${slug}, ${transferType}::"TransferType",
        ${body.fromLocation || ''},
        ${body.toLocation || null},
        ${body.priceFrom || 0},
        ${body.image || null},
        ${body.active !== false},
        NOW(), NOW()
      )
    `;
    await sql`
      INSERT INTO transfer_translations (id, "transferId", locale, title, description)
      VALUES (${randomUUID()}, ${id}, 'en', ${body.title || ''}, ${body.desc || ''})
    `;
    if (body.titleFr) {
      await sql`
        INSERT INTO transfer_translations (id, "transferId", locale, title, description)
        VALUES (${randomUUID()}, ${id}, 'fr', ${body.titleFr || ''}, ${body.descFr || ''})
      `;
    }
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('[POST /api/transfers]', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
