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

    const rows = await sql.query(
      `SELECT t.id, t.slug, t.price, t.duration, t.from_location, t.image_url as image,
              tt.title, tt.description as desc,
              ttfr.title as "titleFr", ttfr.description as "descFr"
       FROM transfers t
       LEFT JOIN transfer_translations tt ON tt.transfer_id = t.id AND tt.locale = 'en'
       LEFT JOIN transfer_translations ttfr ON ttfr.transfer_id = t.id AND ttfr.locale = 'fr'
       ORDER BY t.created_at DESC`
    );

    const result = rows.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      title: locale === 'fr' && t.titleFr ? t.titleFr : t.title,
      titleFr: t.titleFr,
      desc: locale === 'fr' && t.descFr ? t.descFr : t.desc,
      descFr: t.descFr,
      price: t.price,
      duration: t.duration,
      from_location: t.from_location,
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

    await sql.query(
      `INSERT INTO transfers (id, slug, price, duration, from_location, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, slug, body.price, body.duration, body.from_location, body.image || '']
    );

    await sql.query(
      `INSERT INTO transfer_translations (id, transfer_id, locale, title, description)
       VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), id, body.title, body.desc || '']
    );

    if (body.titleFr) {
      await sql.query(
        `INSERT INTO transfer_translations (id, transfer_id, locale, title, description)
         VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), id, body.titleFr, body.descFr || '']
      );
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

    await sql.query(
      `UPDATE transfers SET price=$1, duration=$2, from_location=$3, image_url=$4, updated_at=NOW() WHERE id=$5`,
      [body.price, body.duration, body.from_location, body.image || '', body.id]
    );

    await sql.query(`DELETE FROM transfer_translations WHERE transfer_id=$1`, [body.id]);
    await sql.query(
      `INSERT INTO transfer_translations (id, transfer_id, locale, title, description) VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), body.id, body.title, body.desc || '']
    );
    if (body.titleFr) {
      await sql.query(
        `INSERT INTO transfer_translations (id, transfer_id, locale, title, description) VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), body.id, body.titleFr, body.descFr || '']
      );
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
    await sql.query(`DELETE FROM transfers WHERE id=$1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete transfer' }, { status: 500 });
  }
}