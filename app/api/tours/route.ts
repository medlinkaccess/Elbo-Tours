import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const CAT_MAP: Record<string, string> = {
  DAY_TRIP: 'Day Trips',
  MULTI_DAY: 'Multi-day Tours',
  DESERT: 'Desert Tours',
  MOUNTAIN: 'City Tours',
  CULTURAL: 'City Tours',
  PRIVATE: 'Custom/Private Tours',
}

const CAT_REVERSE: Record<string, string> = {
  'Day Trips': 'DAY_TRIP',
  'Multi-day Tours': 'MULTI_DAY',
  'Desert Tours': 'DESERT',
  'City Tours': 'CULTURAL',
  'Custom/Private Tours': 'PRIVATE',
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
      `SELECT t.id, t.slug, t."imageUrl" as image, t."priceFrom", t."durationText",
              t.featured, t.active, t.category, t."sortOrder",
              tt.title, tt.description as desc,
              ttfr.title as "titleFr", ttfr.description as "descFr"
       FROM tours t
       LEFT JOIN tour_translations tt ON tt."tourId" = t.id AND tt.locale = 'en'
       LEFT JOIN tour_translations ttfr ON ttfr."tourId" = t.id AND ttfr.locale = 'fr'
       WHERE (t.active = true OR $1 = 'admin')
       ORDER BY t."sortOrder" ASC, t."createdAt" DESC`,
      [searchParams.get('admin') || '']
    )

    const result = rows.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      title: locale === 'fr' && t.titleFr ? t.titleFr : t.title,
      titleFr: t.titleFr,
      desc: locale === 'fr' && t.descFr ? t.descFr : t.desc,
      descFr: t.descFr,
      image: t.image,
      category: CAT_MAP[t.category] ?? t.category,
      duration: t.durationText || '',
      from: 'Marrakech',
      price: t.priceFrom > 0 ? `From $${t.priceFrom}` : 'Ask for price',
      priceFrom: t.priceFrom,
      featured: t.featured,
      active: t.active,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/tours', err)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const category = CAT_REVERSE[body.category] || 'DAY_TRIP'

    await sql.query(
      `INSERT INTO tours (id, slug, category, "priceFrom", currency, "durationDays", "durationText", "maxGroupSize", "minGroupSize", featured, active, "sortOrder", "imageUrl", gallery, "createdAt", "updatedAt")
       VALUES ($1,$2,$3::\"TourCategory\",$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'{}'::text[],NOW(),NOW())`,
      [id, slug, category, parseFloat(String(body.price).replace(/[^0-9.]/g, "")) || 0, 'USD', 1, body.duration || '', 12, 1, body.featured || false, true, 0, body.image || '']
    )

    await sql.query(
      `INSERT INTO tour_translations (id, "tourId", locale, title, description) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), id, body.title, body.desc || '']
    )

    if (body.titleFr) {
      await sql.query(
        `INSERT INTO tour_translations (id, "tourId", locale, title, description) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), id, body.titleFr, body.descFr || '']
      )
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/tours', err)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const category = CAT_REVERSE[body.category] || 'DAY_TRIP'

    await sql.query(
      `UPDATE tours SET category=$1::\"TourCategory\", "priceFrom"=$2, "durationText"=$3, "imageUrl"=$4, featured=$5, active=$6, "updatedAt"=NOW() WHERE id=$7`,
      [category, parseFloat(String(body.price).replace(/[^0-9.]/g, "")) || 0, body.duration || '', body.image || '', body.featured || false, body.active !== false, body.id]
    )

    await sql.query(`DELETE FROM tour_translations WHERE "tourId"=$1`, [body.id])
    await sql.query(
      `INSERT INTO tour_translations (id, "tourId", locale, title, description) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), body.id, body.title, body.desc || '']
    )
    if (body.titleFr) {
      await sql.query(
        `INSERT INTO tour_translations (id, "tourId", locale, title, description) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), body.id, body.titleFr, body.descFr || '']
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/tours', err)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM tours WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/tours', err)
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 })
  }
}

