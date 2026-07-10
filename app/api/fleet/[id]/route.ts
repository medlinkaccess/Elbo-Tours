import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    const body = await req.json();
    await sql.query(
      `UPDATE fleet SET price=$1, passengers=$2, bags=$3, image_url=$4, updated_at=NOW() WHERE id=$5`,
      [body.price, body.passengers, body.bags, body.image || '', id]
    );
    await sql.query(`DELETE FROM fleet_translations WHERE fleet_id=$1`, [id]);
    await sql.query(
      `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), id, body.name, body.desc || '']
    );
    if (body.nameFr) {
      await sql.query(
        `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), id, body.nameFr, body.descFr || '']
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/fleet/[id]]', err);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    await sql.query(`DELETE FROM fleet_translations WHERE fleet_id=$1`, [id]);
    await sql.query(`DELETE FROM fleet WHERE id=$1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/fleet/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
