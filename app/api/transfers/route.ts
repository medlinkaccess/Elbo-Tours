import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const CAT_MAP: Record<string, string> = {
  AIRPORT: 'Airport Transfers',
  HOTEL: 'Hotel Transfers',
  CITY: 'City Transfers',
  INTER_CITY: 'Inter-city Transfers',
}

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}
function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get('locale') || 'en'

    const rows = await sql.query(
      `SELECT t.id, t.slug, t.type, t."fromLocation", t."toLocation", t."priceFrom",
              t."imageUrl" as image, t.featured, t.active, t."sortOrder",
              tt.title, tt.description as desc
       FROM transfers t
       LEFT JOIN transfer_translations tt ON tt."transferId" = t.id AND tt.locale = $1
       WHERE t.active = true
       ORDER BY t."sortOrder" ASC, t."createdAt" DESC`,
      [locale]
    )

    const result = rows.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      desc: t.desc,
      image: t.image,
      category: CAT_MAP[t.type] ?? t.type,
      from: t.fromLocation,
      to: t.toLocation,
      price: t.priceFrom > 0 ? `From $${t.priceFrom}` : 'Ask for price',
      duration: 'Door-to-door',
      featured: t.featured,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/transfers', err)
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    await sql.query(
      `INSERT INTO transfers (id, slug, type, "fromLocation", "toLocation", "priceFrom", currency, "imageUrl", featured, active, "sortOrder", "createdAt", "updatedAt")
       VALUES ($1,$2,$3::\"TransferType\",$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())`,
      [id, slug, body.type || 'AIRPORT', body.from || '', body.to || '', parseFloat(body.price) || 0, 'USD', body.image || '', body.featured || false, true, 0]
    )

    await sql.query(
      `INSERT INTO transfer_translations (id, "transferId", locale, title, description) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), id, body.title, body.desc || '']
    )

    if (body.titleFr) {
      await sql.query(
        `INSERT INTO transfer_translations (id, "transferId", locale, title, description) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), id, body.titleFr, body.descFr || '']
      )
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/transfers', err)
    return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')

    await sql.query(
      `UPDATE transfers SET "fromLocation"=$1, "toLocation"=$2, "priceFrom"=$3, "imageUrl"=$4, featured=$5, "updatedAt"=NOW() WHERE id=$6`,
      [body.from || '', body.to || '', parseFloat(body.price) || 0, body.image || '', body.featured || false, body.id]
    )

    await sql.query(`DELETE FROM transfer_translations WHERE "transferId"=$1`, [body.id])
    await sql.query(
      `INSERT INTO transfer_translations (id, "transferId", locale, title, description) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), body.id, body.title, body.desc || '']
    )
    if (body.titleFr) {
      await sql.query(
        `INSERT INTO transfer_translations (id, "transferId", locale, title, description) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), body.id, body.titleFr, body.descFr || '']
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/transfers', err)
    return NextResponse.json({ error: 'Failed to update transfer' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM transfers WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/transfers', err)
    return NextResponse.json({ error: 'Failed to delete transfer' }, { status: 500 })
  }
}