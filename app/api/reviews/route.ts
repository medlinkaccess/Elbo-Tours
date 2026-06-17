import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}
function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const adminMode = searchParams.get('admin') === 'true'

    if (adminMode && !isAuthed(req)) return unauthorized()

    const rows = await sql.query(
      `SELECT r.*, tt.title as "tourTitle"
       FROM reviews r
       LEFT JOIN tour_translations tt ON tt."tourId" = r."tourId" AND tt.locale = 'en'
       ${adminMode ? '' : "WHERE r.status = 'APPROVED'"}
       ORDER BY r."createdAt" DESC`
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/reviews', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()

    await sql.query(
      `INSERT INTO reviews (id, status, rating, "tourId", "authorName", "authorCountry", body, source, featured, "createdAt", "updatedAt")
       VALUES ($1,'PENDING',$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())`,
      [id, body.rating, body.tourId || null, body.authorName, body.authorCountry || null,
       body.body, body.source || 'direct', body.featured || false]
    )

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/reviews', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    await sql.query(
      `UPDATE reviews SET status=$1::\"ReviewStatus\", featured=$2, "updatedAt"=NOW() WHERE id=$3`,
      [body.status, body.featured || false, body.id]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/reviews', err)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM reviews WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/reviews', err)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
