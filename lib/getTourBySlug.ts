import { sql } from '@/lib/db';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}
export interface RelatedTour {
  slug: string;
  title: string;
  priceFrom: number;
  priceDisplay: string | null;
  imageUrl: string | null;
  durationDays: number;
}
export interface TourDetail {
  id: string;
  slug: string;
  category: string;
  priceFrom: number;
  priceDisplay: string | null;
  currency: string;
  durationDays: number;
  durationText: string | null;
  maxGroupSize: number | null;
  minGroupSize: number;
  featured: boolean;
  imageUrl: string | null;
  gallery: string[];
  tags: string[];
  departsFrom: string;
  destinationName: string | null;
  title: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  itinerary: ItineraryDay[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  related: RelatedTour[];
}

/**
 * Fetches a full tour detail by slug, directly via SQL (server-side only).
 * This is the same query logic as app/api/tours/[slug]/route.ts GET handler,
 * extracted so it can be called directly from server components without an
 * HTTP round-trip — needed so the tour detail page can be server-rendered
 * (and therefore crawlable) instead of client-fetched.
 */
export async function getTourBySlug(slug: string, locale: string): Promise<TourDetail | null> {
  const fallbackLocale = 'en';

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
    return null;
  }

  const tour = tourRows[0];

  const translationRows = await sql`
    SELECT locale, title, description, itinerary, "metaTitle", "metaDesc"
    FROM tour_translations
    WHERE "tourId" = ${tour.id}
    ORDER BY locale
  `;

  const translationMap = Object.fromEntries(
    translationRows.map((r: any) => [r.locale, r])
  );

  const translation =
    translationMap[locale] ||
    translationMap[fallbackLocale] ||
    translationRows[0] ||
    {};

  let itinerary: ItineraryDay[] = [];
  if (translation.itinerary) {
    try {
      itinerary = JSON.parse(translation.itinerary);
    } catch {
      itinerary = [{ day: 1, title: 'Itinerary', description: translation.itinerary }];
    }
  }

  const highlightRows = await sql`
    SELECT text FROM tour_highlights
    WHERE "tourId" = ${tour.id} AND locale = ${locale}
    ORDER BY id
  `;
  const highlights = highlightRows.length > 0
    ? highlightRows.map((r: any) => r.text)
    : (await sql`
        SELECT text FROM tour_highlights
        WHERE "tourId" = ${tour.id} AND locale = 'en'
        ORDER BY id
      `).map((r: any) => r.text);

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

  const includes = incRows.filter((r: any) => r.included).map((r: any) => r.text);
  const excludes = incRows.filter((r: any) => !r.included).map((r: any) => r.text);

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

  return {
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

    title: translation.title || slug,
    description: translation.description || '',
    metaTitle: translation.metaTitle || translation.title || slug,
    metaDesc: translation.metaDesc || translation.description || '',

    itinerary,
    highlights,
    includes,
    excludes,
    related: relatedRows as unknown as RelatedTour[],
  };
}
