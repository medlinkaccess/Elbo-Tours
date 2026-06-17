import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}
function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const rows = await sql.query(
      `SELECT b.*, 
              tt.title as "tourTitle",
              trt.title as "transferTitle"
       FROM bookings b
       LEFT JOIN tour_translations tt ON tt."tourId" = b."tourId" AND tt.locale = 'en'
       LEFT JOIN transfer_translations trt ON trt."transferId" = b."transferId" AND trt.locale = 'en'
       ORDER BY b."createdAt" DESC`
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/bookings', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()
    const ref = 'ELBO-' + Math.random().toString(36).substring(2, 7).toUpperCase()

    await sql.query(
      `INSERT INTO bookings (id, reference, status, "tourId", "transferId", "guestName", "guestEmail", "guestPhone", "guestCount", "travelDate", "pickupTime", "pickupLocation", "specialRequests", "totalPrice", currency, "createdAt", "updatedAt")
       VALUES ($1,$2,'PENDING',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())`,
      [id, ref, body.tourId || null, body.transferId || null, body.guestName, body.guestEmail,
       body.guestPhone || null, body.guestCount || 1, body.travelDate, body.pickupTime || null,
       body.pickupLocation || null, body.specialRequests || null, body.totalPrice || null, body.currency || 'USD']
    )

    return NextResponse.json({ id, reference: ref }, { status: 201 })
  } catch (err) {
    console.error('POST /api/bookings', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    await sql.query(
      `UPDATE bookings SET status=$1::\"BookingStatus\", notes=$2, "confirmedAt"=$3, "updatedAt"=NOW() WHERE id=$4`,
      [body.status, body.notes || null, body.status === 'CONFIRMED' ? new Date() : null, body.id]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/bookings', err)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM bookings WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/bookings', err)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
