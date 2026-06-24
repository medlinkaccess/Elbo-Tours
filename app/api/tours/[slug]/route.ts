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

    // FR highlights
    const highlightsFrRows = await sql`
      SELECT text FROM tour_highlights
      WHERE "tourId" = ${tour.id} AND locale = 'fr'
      ORDER BY id
    `;
    const highlightsFr = highlightsFrRows.map((r: any) => r.text);

    // FR inclusions
    const incFrRows = await sql`
      SELECT text, included FROM tour_inclusions
      WHERE "tourId" = ${tour.id} AND locale = 'fr'
      ORDER BY included DESC, id
    `;
    const includesFr = incFrRows.filter((r: any) => r.included).map((r: any) => r.text);
    const excludesFr = incFrRows.filter((r: any) => !r.included).map((r: any) => r.text);

    // FR translation (for itinerary)
    const frTranslation = translationMap['fr'] || {};
    let itineraryFr: { day: number; title: string; description: string }[] = [];
    if (frTranslation.itinerary) {
      try { itineraryFr = JSON.parse(frTranslation.itinerary); } catch { itineraryFr = []; }
    }

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
      highlightsFr,
      includesFr,
      excludesFr,
      itineraryFr,
    });
  } catch (err) {
    console.error('[GET /api/tours/[slug]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const authed = cookieHeader.includes("admin_auth=true");
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const body = await req.json();
  const { randomUUID } = await import("crypto");

  const CAT_REVERSE: Record<string, string> = {
    "Day Trips": "DAY_TRIP",
    "Multi-day Tours": "MULTI_DAY",
    "Desert Tours": "DESERT",
    "City Tours": "CULTURAL",
    "Custom/Private Tours": "PRIVATE",
  };

  try {
    const rows = await sql`SELECT id FROM tours WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const id = rows[0].id;

    const category = CAT_REVERSE[body.category] || "DAY_TRIP";
    const price = parseFloat(String(body.price || body.priceFrom || 0).replace(/[^0-9.]/g, "")) || 0;
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
    const gallery = Array.isArray(body.gallery) ? body.gallery : [];
    const maxGroup = parseInt(body.maxGroupSize) || 12;

    await sql`
      UPDATE tours SET
        category = ${category}::"TourCategory",
        "priceFrom" = ${price},
        "durationText" = ${body.duration || ""},
        "imageUrl" = ${body.image || ""},
        featured = ${body.featured || false},
        active = ${body.active !== false},
        tags = ${tags},
        "departsFrom" = ${body.departsFrom || "Marrakech"},
        "maxGroupSize" = ${maxGroup},
        gallery = ${gallery},
        "priceDisplay" = ${body.priceDisplay || null},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    await sql`DELETE FROM tour_translations WHERE "tourId" = ${id}`;
    await sql`
      INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
      VALUES (
        ${randomUUID()}, ${id}, ${"en"},
        ${body.title || ""},
        ${body.desc || ""},
        ${JSON.stringify(body.itinerary || [])},
        ${body.title || ""},
        ${body.desc || ""}
      )
    `;
    if (body.titleFr) {
      await sql`
        INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
        VALUES (
          ${randomUUID()}, ${id}, ${"fr"},
          ${body.titleFr || ""},
          ${body.descFr || ""},
          ${JSON.stringify(body.itineraryFr || body.itinerary || [])},
          ${body.titleFr || ""},
          ${body.descFr || ""}
        )
      `;
    }

    await sql`DELETE FROM tour_highlights WHERE "tourId" = ${id}`;
    for (const h of (body.highlights || [])) {
      if (h.trim()) await sql`INSERT INTO tour_highlights (id, "tourId", locale, text) VALUES (${randomUUID()}, ${id}, ${"en"}, ${h.trim()})`;
    }
    for (const h of (body.highlightsFr || [])) {
      if (h.trim()) await sql`INSERT INTO tour_highlights (id, "tourId", locale, text) VALUES (${randomUUID()}, ${id}, ${"fr"}, ${h.trim()})`;
    }

    await sql`DELETE FROM tour_inclusions WHERE "tourId" = ${id}`;
    for (const item of (body.includes || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"en"}, ${item.trim()}, ${true})`;
    }
    for (const item of (body.excludes || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"en"}, ${item.trim()}, ${false})`;
    }
    for (const item of (body.includesFr || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"fr"}, ${item.trim()}, ${true})`;
    }
    for (const item of (body.excludesFr || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"fr"}, ${item.trim()}, ${false})`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const authed = cookieHeader.includes("admin_auth=true");
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = params;
  try {
    await sql`DELETE FROM tours WHERE slug = ${slug}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
