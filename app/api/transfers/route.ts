import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    const rows = await sql`
      SELECT
        t.id, t.slug, t."priceFrom", t.currency, t."fromLocation", t."imageUrl" as image,
        tt.title, tt.description as desc, tt."metaTitle", tt."metaDesc",
        ttfr.title as "titleFr", ttfr.description as "descFr"
      FROM transfers t
      LEFT JOIN transfer_translations tt
        ON tt."transferId" = t.id AND tt.locale = 'en'
      LEFT JOIN transfer_translations ttfr
        ON ttfr."transferId" = t.id AND ttfr.locale = 'fr'
      WHERE t.active = true
      ORDER BY t."sortOrder", t."createdAt" DESC
    `;

    const result = rows.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      title: locale === 'fr' && t.titleFr ? t.titleFr : t.title,
      titleFr: t.titleFr,
      desc: locale === 'fr' && t.descFr ? t.descFr : t.desc,
      descFr: t.descFr,
      priceFrom: t.priceFrom,
      currency: t.currency,
      fromLocation: t.fromLocation,
      image: t.image,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const id = randomUUID();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const now = new Date().toISOString();

    await sql`
      INSERT INTO transfers (id, slug, type, "fromLocation", "priceFrom", currency, "vehicleTypes", "flightTracking", "meetAndGreet", active, "sortOrder", "imageUrl", "createdAt", "updatedAt")
      VALUES (
        ${id}, ${slug}, 'AIRPORT'::"TransferType",
        ${body.fromLocation || ''}, ${body.priceFrom || 0}, ${body.currency || 'EUR'},
        '{}', true, true, true, 0, ${body.image || ''},
        ${now}, ${now}
      )
    `;

    await sql`
      INSERT INTO transfer_translations (id, "transferId", locale, title, description)
      VALUES (${randomUUID()}, ${id}, 'en', ${body.title}, ${body.desc || ''})
    `;

    if (body.titleFr) {
      await sql`
        INSERT INTO transfer_translations (id, "transferId", locale, title, description)
        VALUES (${randomUUID()}, ${id}, 'fr', ${body.titleFr}, ${body.descFr || ''})
      `;
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();

    await sql`
      UPDATE transfers
      SET "priceFrom" = ${body.priceFrom || 0},
          "fromLocation" = ${body.fromLocation || ''},
          "imageUrl" = ${body.image || ''},
          "updatedAt" = NOW()
      WHERE id = ${body.id}
    `;

    await sql`DELETE FROM transfer_translations WHERE "transferId" = ${body.id}`;

    await sql`
      INSERT INTO transfer_translations (id, "transferId", locale, title, description)
      VALUES (${randomUUID()}, ${body.id}, 'en', ${body.title}, ${body.desc || ''})
    `;

    if (body.titleFr) {
      await sql`
        INSERT INTO transfer_translations (id, "transferId", locale, title, description)
        VALUES (${randomUUID()}, ${body.id}, 'fr', ${body.titleFr}, ${body.descFr || ''})
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update transfer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    await sql`DELETE FROM transfer_translations WHERE "transferId" = ${id}`;
    await sql`DELETE FROM transfers WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete transfer' }, { status: 500 });
  }
}
