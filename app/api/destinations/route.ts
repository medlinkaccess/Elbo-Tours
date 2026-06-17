import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = (searchParams.get('locale') || 'en') as 'en' | 'fr'
    const featured = searchParams.get('featured')

    const destinations = await prisma.destination.findMany({
      where: { ...(featured === 'true' && { featured: true }) },
      include: { translations: { where: { locale } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    const result = destinations.map(($1: any) => ({
      id: d.id,
      slug: d.slug,
      featured: d.featured,
      imageUrl: d.imageUrl,
      ...d.translations[0],
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/destinations', err)
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const destination = await prisma.destination.create({
      data: {
        slug: body.slug,
        featured: body.featured || false,
        imageUrl: body.imageUrl || null,
        sortOrder: body.sortOrder || 0,
        translations: { create: body.translations || [] },
      },
    })
    return NextResponse.json(destination, { status: 201 })
  } catch (err) {
    console.error('POST /api/destinations', err)
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { id, translations, ...data } = body
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...data,
        ...(translations && {
          translations: { deleteMany: {}, create: translations },
        }),
      },
    })
    return NextResponse.json(destination)
  } catch (err) {
    console.error('PUT /api/destinations', err)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await prisma.destination.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/destinations', err)
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

