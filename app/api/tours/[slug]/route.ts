import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const locale = new URL(req.url).searchParams.get('locale') || 'en';
  const fallbackLocale = 'en';

  try {
    // 1. Base tour row
    const tourRows = await sql`
      SELECT
        t.id, t.slug, t.category, t."priceFrom", t."priceDisplay", t.currency,
        t."durationDays", t."durationText", t."maxGroupSize", t."minGroupSize",
        t.featured, t.active, t."sortOrder", t."imageUrl", t.gallery,
        t.tags, t."departsFrom", t."createdAt",
        null as "destinationName"
      FROM tours t
      WHERE t.slug = ${slug} AND t.active = true
      LIMIT 1
    `;

    if (tourRows.length === 0) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const tour = tourRows[0];

    // 2. Translation — prefer requested locale, fall back to 'en'
    const translationRows = await sql`
      SELECT locale, title, description, itinerary, "metaTitle", "metaDesc"
      FROM tour_translations
      WHERE "tourId" = ${tour.id}
      ORDER BY locale
    `;

    const translationMap = Object.fromEntries(
      translationRows.map(r => [r.locale, r])
    );

    const translation =
      translationMap[locale] ||
      translationMap[fallbackLocale] ||
      translationRows[0] ||
      {};

    // 3. Parse itinerary — stored as JSON string, e.g. [{day, title, description}]
    let itinerary: { day: number; title: string; description: string }[] = [];
    if (translation.itinerary) {
      try {
        itinerary = JSON.parse(translation.itinerary);
      } catch {
        // If it's plain markdown text, wrap it
        itinerary = [{ day: 1, title: 'Itinerary', description: translation.itinerary }];
      }
    }

    // 4. Highlights
    const highlightRows = await sql`
      SELECT text FROM tour_highlights
      WHERE "tourId" = ${tour.id} AND locale = ${locale}
      ORDER BY id
    `;
    // Fall back to 'en' if no highlights for requested locale
    const highlights = highlightRows.length > 0
      ? highlightRows.map(r => r.text)
      : (await sql`
          SELECT text FROM tour_highlights
          WHERE "tourId" = ${tour.id} AND locale = 'en'
          ORDER BY id
        `).map(r => r.text);

    // 5. Inclusions — split by included boolean
    const inclusionRows = await sql`
      SELECT text, included FROM tour_inclusions
      WHERE "tourId" = ${tour.id} AND locale = ${locale}
      ORDER BY included DESC, id
    `;
    const incRows = inclusionRows.length > 0 ? inclusionRows : await sql`
      SELECT text, included FROM tour_inclusions
      WHERE "tourId" = ${tour.id} AND locale = 'en'
      ORDER BY included DESC, id
    `;

    const includes = incRows.filter(r => r.included).map(r => r.text);
    const excludes = incRows.filter(r => !r.included).map(r => r.text);

    // 6. Related tours (same category, different slug, max 3)
    const relatedRows = await sql`
      SELECT t.slug, t."priceFrom", t."priceDisplay", t."imageUrl", t."durationDays",
             tt.title
      FROM tours t
      LEFT JOIN tour_translations tt ON tt."tourId" = t.id AND tt.locale = ${locale}
      WHERE t.category = ${tour.category}
        AND t.slug != ${slug}
        AND t.active = true
      ORDER BY t."sortOrder", t."createdAt"
      LIMIT 3
    `;

    return NextResponse.json({
      id: tour.id,
      slug: tour.slug,
      category: tour.category,
      priceFrom: tour.priceFrom,
      priceDisplay: tour.priceDisplay || null,
      currency: tour.currency,
      durationDays: tour.durationDays,
      durationText: tour.durationText,
      maxGroupSize: tour.maxGroupSize,
      minGroupSize: tour.minGroupSize,
      featured: tour.featured,
      imageUrl: tour.imageUrl,
      gallery: tour.gallery || [],
      tags: tour.tags || [],
      departsFrom: tour.departsFrom || '',
      destinationName: tour.destinationName || null,

      // From translation
      title: translation.title || slug,
      description: translation.description || '',
      metaTitle: translation.metaTitle || translation.title || slug,
      metaDesc: translation.metaDesc || translation.description || '',

      itinerary,
      highlights,
      includes,
      excludes,
      related: relatedRows,
    });
  } catch (err) {
    console.error('[GET /api/tours/[slug]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

