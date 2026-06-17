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
      `SELECT f.id, f.slug, f.price, f.passengers, f.bags, f.image_url as image,
              ft.name, ft.description as desc,
              ftfr.name as "nameFr", ftfr.description as "descFr"
       FROM fleet f
       LEFT JOIN fleet_translations ft ON ft.fleet_id = f.id AND ft.locale = 'en'
       LEFT JOIN fleet_translations ftfr ON ftfr.fleet_id = f.id AND ftfr.locale = 'fr'
       ORDER BY f.created_at DESC`
    );

    const result = rows.map((f: any) => ({
      id: f.id,
      slug: f.slug,
      name: locale === 'fr' && f.nameFr ? f.nameFr : f.name,
      nameFr: f.nameFr,
      desc: locale === 'fr' && f.descFr ? f.descFr : f.desc,
      descFr: f.descFr,
      price: f.price,
      passengers: f.passengers,
      bags: f.bags,
      image: f.image,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch fleet' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const id = randomUUID();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    await sql.query(
      `INSERT INTO fleet (id, slug, price, passengers, bags, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, slug, body.price, body.passengers, body.bags, body.image || '']
    );

    await sql.query(
      `INSERT INTO fleet_translations (id, fleet_id, locale, name, description)
       VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), id, body.name, body.desc || '']
    );

    if (body.nameFr) {
      await sql.query(
        `INSERT INTO fleet_translations (id, fleet_id, locale, name, description)
         VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), id, body.nameFr, body.descFr || '']
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();

    await sql.query(
      `UPDATE fleet SET price=$1, passengers=$2, bags=$3, image_url=$4, updated_at=NOW() WHERE id=$5`,
      [body.price, body.passengers, body.bags, body.image || '', body.id]
    );

    await sql.query(`DELETE FROM fleet_translations WHERE fleet_id=$1`, [body.id]);
    await sql.query(
      `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), body.id, body.name, body.desc || '']
    );
    if (body.nameFr) {
      await sql.query(
        `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), body.id, body.nameFr, body.descFr || '']
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    await sql.query(`DELETE FROM fleet WHERE id=$1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}