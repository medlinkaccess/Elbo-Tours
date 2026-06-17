import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = (searchParams.get('locale') || 'en') as 'en' | 'fr'
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'PUBLISHED'
    const destinationId = searchParams.get('destinationId')

    const blogs = await prisma.blog.findMany({
      where: {
        status: status as any,
        ...(featured === 'true' && { featured: true }),
        ...(destinationId && { destinationId }),
      },
      include: {
        translations: { where: { locale } },
        destination: { include: { translations: { where: { locale } } } },
      },
      orderBy: { publishedAt: 'desc' },
    })

    const result = blogs.map((b: any) => ({
      id: b.id,
      slug: b.slug,
      status: b.status,
      imageUrl: b.imageUrl,
      readingMins: b.readingMins,
      featured: b.featured,
      publishedAt: b.publishedAt,
      destination: b.destination
        ? { id: b.destination.id, name: b.destination.translations[0]?.name }
        : null,
      ...b.translations[0],
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/blog', err)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const blog = await prisma.blog.create({
      data: {
        slug: body.slug,
        status: body.status || 'DRAFT',
        imageUrl: body.imageUrl || null,
        readingMins: body.readingMins || 5,
        featured: body.featured || false,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        destinationId: body.destinationId || null,
        translations: { create: body.translations || [] },
      },
    })
    return NextResponse.json(blog, { status: 201 })
  } catch (err) {
    console.error('POST /api/blog', err)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { id, translations, ...data } = body

    const existing = await prisma.blog.findUnique({ where: { id } })
    const isPublishing = data.status === 'PUBLISHED' && existing?.status !== 'PUBLISHED'

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        ...(isPublishing && { publishedAt: new Date() }),
        ...(translations && {
          translations: { deleteMany: {}, create: translations },
        }),
      },
    })
    return NextResponse.json(blog)
  } catch (err) {
    console.error('PUT /api/blog', err)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await prisma.blog.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/blog', err)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}


