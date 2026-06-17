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
    const locale = searchParams.get('locale') || 'en'

    const rows = await sql.query(
      `SELECT f.id, f."sortOrder", ft.question, ft.answer
       FROM faqs f
       LEFT JOIN faq_translations ft ON ft."faqId" = f.id AND ft.locale = $1
       WHERE f.active = true
       ORDER BY f."sortOrder" ASC, f."createdAt" ASC`,
      [locale]
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/faqs', err)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()

    await sql.query(
      `INSERT INTO faqs (id, "sortOrder", active, "createdAt") VALUES ($1,$2,true,NOW())`,
      [id, body.sortOrder || 0]
    )

    await sql.query(
      `INSERT INTO faq_translations (id, "faqId", locale, question, answer) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), id, body.question, body.answer || '']
    )

    if (body.questionFr) {
      await sql.query(
        `INSERT INTO faq_translations (id, "faqId", locale, question, answer) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), id, body.questionFr, body.answerFr || '']
      )
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/faqs', err)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')

    await sql.query(`UPDATE faqs SET "sortOrder"=$1 WHERE id=$2`, [body.sortOrder || 0, body.id])
    await sql.query(`DELETE FROM faq_translations WHERE "faqId"=$1`, [body.id])

    await sql.query(
      `INSERT INTO faq_translations (id, "faqId", locale, question, answer) VALUES ($1,$2,'en',$3,$4)`,
      [randomUUID(), body.id, body.question, body.answer || '']
    )
    if (body.questionFr) {
      await sql.query(
        `INSERT INTO faq_translations (id, "faqId", locale, question, answer) VALUES ($1,$2,'fr',$3,$4)`,
        [randomUUID(), body.id, body.questionFr, body.answerFr || '']
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/faqs', err)
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM faqs WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/faqs', err)
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }
}

