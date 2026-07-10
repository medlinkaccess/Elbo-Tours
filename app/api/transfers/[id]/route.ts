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
    const transferType = body.type === 'INTER_CITY' ? 'INTER_CITY' : 'AIRPORT';
    await sql`
      UPDATE transfers
      SET type = ${transferType}::"TransferType",
          "fromLocation" = ${body.fromLocation || ''},
          "toLocation" = ${body.toLocation || null},
          "priceFrom" = ${body.priceFrom || 0},
          "imageUrl" = ${body.image || null},
          active = ${body.active !== false},
          "updatedAt" = NOW()
      WHERE id = ${id}
    `;
    await sql`DELETE FROM transfer_translations WHERE "transferId" = ${id}`;
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/transfers/[id]]', err);
    return NextResponse.json({ error: 'Failed to update transfer' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    await sql`DELETE FROM transfer_translations WHERE "transferId" = ${id}`;
    await sql`DELETE FROM transfers WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/transfers/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete transfer' }, { status: 500 });
  }
}
