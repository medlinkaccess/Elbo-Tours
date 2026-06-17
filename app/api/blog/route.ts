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
    const adminMode = searchParams.get('admin') === 'true'

    const rows = await sql.query(
      `SELECT b.id, b.slug, b.status, b."imageUrl" as image, b."readingMins", b.featured, b."publishedAt", b."createdAt",
              bt.title, bt.excerpt, bt.content
       FROM blogs b
       LEFT JOIN blog_translations bt ON bt."blogId" = b.id AND bt.locale = $1
       ${adminMode ? '' : "WHERE b.status = 'PUBLISHED'"}
       ORDER BY b."publishedAt" DESC NULLS LAST, b."createdAt" DESC`,
      [locale]
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/blog', err)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')
    const id = randomUUID()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    await sql.query(
      `INSERT INTO blogs (id, slug, status, "imageUrl", "readingMins", featured, "publishedAt", "createdAt", "updatedAt")
       VALUES ($1,$2,$3::\"BlogStatus\",$4,$5,$6,$7,NOW(),NOW())`,
      [id, slug, body.status || 'DRAFT', body.image || '', body.readingMins || 5, body.featured || false, body.status === 'PUBLISHED' ? new Date() : null]
    )

    await sql.query(
      `INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,'en',$3,$4,$5)`,
      [randomUUID(), id, body.title, body.excerpt || '', body.content || '']
    )

    if (body.titleFr) {
      await sql.query(
        `INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,'fr',$3,$4,$5)`,
        [randomUUID(), id, body.titleFr, body.excerptFr || '', body.contentFr || '']
      )
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/blog', err)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { randomUUID } = await import('crypto')

    await sql.query(
      `UPDATE blogs SET status=$1::\"BlogStatus\", "imageUrl"=$2, "readingMins"=$3, featured=$4,
       "publishedAt"=$5, "updatedAt"=NOW() WHERE id=$6`,
      [body.status || 'DRAFT', body.image || '', body.readingMins || 5, body.featured || false,
       body.status === 'PUBLISHED' ? new Date() : null, body.id]
    )

    await sql.query(`DELETE FROM blog_translations WHERE "blogId"=$1`, [body.id])
    await sql.query(
      `INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,'en',$3,$4,$5)`,
      [randomUUID(), body.id, body.title, body.excerpt || '', body.content || '']
    )
    if (body.titleFr) {
      await sql.query(
        `INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,'fr',$3,$4,$5)`,
        [randomUUID(), body.id, body.titleFr, body.excerptFr || '', body.contentFr || '']
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/blog', err)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await sql.query(`DELETE FROM blogs WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/blog', err)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
