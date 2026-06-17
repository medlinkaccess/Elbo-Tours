import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = (searchParams.get('locale') || 'en') as 'en' | 'fr'
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const destinationId = searchParams.get('destinationId')

    const activities = await prisma.activity.findMany({
      where: {
        active: true,
        ...(category && { category: category as any }),
        ...(featured === 'true' && { featured: true }),
        ...(destinationId && { destinationId }),
      },
      include: {
        translations: { where: { locale } },
        destination: { include: { translations: { where: { locale } } } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    const result = activities.map((a) => ({
      id: a.id,
      slug: a.slug,
      category: a.category,
      priceFrom: a.priceFrom,
      currency: a.currency,
      durationHours: a.durationHours,
      durationText: a.durationText,
      maxGroupSize: a.maxGroupSize,
      featured: a.featured,
      imageUrl: a.imageUrl,
      gallery: a.gallery,
      destination: a.destination
        ? { id: a.destination.id, name: a.destination.translations[0]?.name }
        : null,
      ...a.translations[0],
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('GET /api/activities', err)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const activity = await prisma.activity.create({
      data: {
        slug: body.slug,
        category: body.category,
        priceFrom: body.priceFrom,
        currency: body.currency || 'EUR',
        durationHours: body.durationHours || null,
        durationText: body.durationText || null,
        maxGroupSize: body.maxGroupSize || null,
        featured: body.featured || false,
        imageUrl: body.imageUrl || null,
        gallery: body.gallery || [],
        destinationId: body.destinationId || null,
        translations: { create: body.translations || [] },
      },
    })
    return NextResponse.json(activity, { status: 201 })
  } catch (err) {
    console.error('POST /api/activities', err)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const body = await req.json()
    const { id, translations, ...data } = body
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        ...data,
        ...(translations && {
          translations: { deleteMany: {}, create: translations },
        }),
      },
    })
    return NextResponse.json(activity)
  } catch (err) {
    console.error('PUT /api/activities', err)
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()
  try {
    const { id } = await req.json()
    await prisma.activity.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/activities', err)
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
  }
}

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
