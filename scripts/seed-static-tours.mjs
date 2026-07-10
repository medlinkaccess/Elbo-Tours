/**
 * seed-static-tours.mjs (v2 — fixed updatedAt)
 *
 * Inserts grand-maroc and classic-morocco into Postgres.
 * Run: node --env-file=.env.local scripts/seed-static-tours.mjs
 */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const STATIC_TOURS = [
  {
    slug: "grand-maroc",
    category: "MULTI_DAY",
    priceFrom: 890,
    priceDisplay: "From €890",
    currency: "EUR",
    durationDays: 10,
    durationText: "10 days / 9 nights",
    maxGroupSize: 12,
    minGroupSize: 2,
    featured: true,
    departsFrom: "Marrakech",
    tags: ["multi-day", "imperial-cities", "desert", "popular"],
    translations: {
      en: {
        title: "Grand Morocco Tour",
        description: "The definitive Morocco experience — 10 days covering imperial cities, Sahara dunes, ancient kasbahs, and Atlantic coast. A journey through the full spectrum of Moroccan culture and landscape.",
        metaTitle: "Grand Morocco Tour — 10 Days | Elbo Tours",
        metaDesc: "Experience all of Morocco in 10 days: Marrakech, Fes, Chefchaouen, Sahara Desert, Casablanca. Small groups, expert guides.",
        itinerary: JSON.stringify([
          { day: 1, title: "Arrival in Marrakech", description: "Meet your guide and explore the Jemaa el-Fna square at dusk." },
          { day: 2, title: "Marrakech Deep Dive", description: "Bahia Palace, Saadian Tombs, souks, and Majorelle Garden." },
          { day: 3, title: "High Atlas to Ait Benhaddou", description: "Cross Tizi n'Tichka pass, visit the UNESCO kasbah." },
          { day: 4, title: "Draa Valley to Zagora", description: "Palm groves, rose valley, and first Sahara views." },
          { day: 5, title: "Merzouga Dunes", description: "Erg Chebbi dunes, camel trek, desert camp overnight." },
          { day: 6, title: "Ziz Valley to Fes", description: "Ziz Gorge, Midelt, arrive in Fes by evening." },
          { day: 7, title: "Fes el-Bali", description: "Full day in the medina: tanneries, Al-Qarawiyyin, Bou Inania." },
          { day: 8, title: "Fes to Chefchaouen", description: "The Blue Pearl — free afternoon to wander the blue alleys." },
          { day: 9, title: "Chefchaouen to Casablanca", description: "Drive via Rabat, visit Hassan II Mosque." },
          { day: 10, title: "Casablanca Departure", description: "Morning in Casa, airport transfer included." },
        ]),
      },
      fr: {
        title: "Grand Tour du Maroc",
        description: "L'expérience marocaine définitive — 10 jours couvrant les villes impériales, les dunes du Sahara, les anciennes kasbahs et la côte atlantique.",
        metaTitle: "Grand Tour du Maroc — 10 Jours | Elbo Tours",
        metaDesc: "Découvrez tout le Maroc en 10 jours : Marrakech, Fès, Chefchaouen, Désert du Sahara, Casablanca. Petits groupes, guides experts.",
        itinerary: null,
      },
    },
    highlights: [
      "Sahara desert camel trek and overnight camp",
      "UNESCO World Heritage kasbah at Ait Benhaddou",
      "Fes el-Bali medina — largest car-free urban area in the world",
      "Chefchaouen blue city",
      "Hassan II Mosque, Casablanca",
      "Expert English/French speaking guide throughout",
    ],
    includes: [
      "9 nights accommodation (riads and desert camp)",
      "All breakfasts and 8 dinners",
      "Private air-conditioned vehicle",
      "Licensed English/French guide",
      "All entrance fees listed in itinerary",
      "Camel trek and Sahara camp",
      "Airport transfers (arrival and departure)",
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Lunches and drinks",
      "Personal spending money",
      "Optional activities",
    ],
  },
  {
    slug: "classic-morocco",
    category: "MULTI_DAY",
    priceFrom: 590,
    priceDisplay: "From €590",
    currency: "EUR",
    durationDays: 7,
    durationText: "7 days / 6 nights",
    maxGroupSize: 12,
    minGroupSize: 2,
    featured: true,
    departsFrom: "Marrakech",
    tags: ["multi-day", "classic", "desert", "best-seller"],
    translations: {
      en: {
        title: "Classic Morocco",
        description: "Seven days hitting Morocco's greatest hits: Marrakech, the Sahara, Ait Benhaddou, and Fes. The perfect first Morocco trip.",
        metaTitle: "Classic Morocco Tour — 7 Days | Elbo Tours",
        metaDesc: "7-day Morocco tour: Marrakech, Sahara Desert, Ait Benhaddou kasbah, Dades Gorge, Fes. Best value small group tour.",
        itinerary: JSON.stringify([
          { day: 1, title: "Marrakech Arrival", description: "Jemaa el-Fna evening introduction with your guide." },
          { day: 2, title: "Marrakech Sights", description: "Bahia Palace, souks, Majorelle Garden." },
          { day: 3, title: "Marrakech to Ait Benhaddou", description: "High Atlas crossing, kasbah visit, Ouarzazate." },
          { day: 4, title: "Draa Valley to Merzouga", description: "Skoura palmeraie, Dades, arrive at dunes." },
          { day: 5, title: "Sahara to Ziz Valley", description: "Sunrise on dunes, camel ride, drive north via Ziz Gorge." },
          { day: 6, title: "Arrive Fes", description: "Scenic drive, afternoon arrival, medina orientation walk." },
          { day: 7, title: "Fes & Departure", description: "Morning medina tour, afternoon departure." },
        ]),
      },
      fr: {
        title: "Maroc Classique",
        description: "Sept jours pour découvrir les incontournables du Maroc : Marrakech, le Sahara, Aït Benhaddou et Fès. Le voyage parfait pour une première fois au Maroc.",
        metaTitle: "Tour Maroc Classique — 7 Jours | Elbo Tours",
        metaDesc: "Circuit Maroc 7 jours : Marrakech, Désert du Sahara, Kasbah Aït Benhaddou, Gorges du Dadès, Fès. Meilleur rapport qualité/prix.",
        itinerary: null,
      },
    },
    highlights: [
      "Erg Chebbi dunes camel trek at sunset",
      "Ait Benhaddou UNESCO kasbah",
      "Dades Gorge scenic drive",
      "Fes el-Bali medina",
      "Berber overnight desert camp",
      "Small group maximum 12 people",
    ],
    includes: [
      "6 nights accommodation (riads and desert camp)",
      "All breakfasts and 5 dinners",
      "Private air-conditioned vehicle",
      "Licensed English/French guide",
      "Camel trek and Sahara camp",
      "All entrance fees",
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Lunches",
      "Drinks",
      "Personal expenses",
    ],
  },
];

async function seed() {
  console.log("=== Seeding static tours into Postgres (v2) ===\n");

  const now = new Date().toISOString();

  for (const tour of STATIC_TOURS) {
    const existing = await sql`SELECT id FROM tours WHERE slug = ${tour.slug}`;
    if (existing.length > 0) {
      console.log(`SKIP (already exists): ${tour.slug}`);
      continue;
    }

    const inserted = await sql`
      INSERT INTO tours (
        id, slug, category, "priceFrom", "priceDisplay", currency,
        "durationDays", "durationText", "maxGroupSize", "minGroupSize",
        featured, active, "sortOrder", "imageUrl", gallery,
        "departsFrom", tags, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${tour.slug},
        ${tour.category}::"TourCategory",
        ${tour.priceFrom},
        ${tour.priceDisplay},
        ${tour.currency},
        ${tour.durationDays},
        ${tour.durationText},
        ${tour.maxGroupSize},
        ${tour.minGroupSize},
        ${tour.featured},
        true,
        0,
        '',
        '{}',
        ${tour.departsFrom},
        ${tour.tags},
        ${now},
        ${now}
      )
      RETURNING id
    `;

    const tourId = inserted[0].id;
    console.log(`INSERTED tour: ${tour.slug} (id: ${tourId})`);

    for (const [locale, t] of Object.entries(tour.translations)) {
      await sql`
        INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
        VALUES (
          gen_random_uuid(),
          ${tourId},
          ${locale}::"Locale",
          ${t.title},
          ${t.description},
          ${t.itinerary || null},
          ${t.metaTitle || null},
          ${t.metaDesc || null}
        )
        ON CONFLICT ("tourId", locale) DO NOTHING
      `;
      console.log(`  INSERTED translation: ${locale}`);
    }

    for (const text of tour.highlights) {
      await sql`
        INSERT INTO tour_highlights (id, "tourId", locale, text)
        VALUES (gen_random_uuid(), ${tourId}, 'en', ${text})
      `;
    }
    console.log(`  INSERTED ${tour.highlights.length} highlights`);

    for (const text of tour.includes) {
      await sql`
        INSERT INTO tour_inclusions (id, "tourId", locale, text, included)
        VALUES (gen_random_uuid(), ${tourId}, 'en', ${text}, true)
      `;
    }
    for (const text of tour.excludes) {
      await sql`
        INSERT INTO tour_inclusions (id, "tourId", locale, text, included)
        VALUES (gen_random_uuid(), ${tourId}, 'en', ${text}, false)
      `;
    }
    console.log(`  INSERTED ${tour.includes.length} includes + ${tour.excludes.length} excludes`);
    console.log("");
  }

  const count = await sql`SELECT COUNT(*) as n FROM tours`;
  console.log(`✓ tours table now has ${count[0].n} rows total`);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
