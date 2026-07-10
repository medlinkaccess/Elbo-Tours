/**
 * seed-morocco-routes.mjs
 *
 * Adds new AIRPORT (Marrakech-local) and CITY_TO_CITY transfer routes,
 * researched from competitor pricing (Anaconda Tours) as a REFERENCE FLOOR.
 * priceFrom values below are the competitor's cheapest tier (1-3 pax) —
 * review and adjust before going live, do not assume these are your final prices.
 *
 * Uses the same transfers/transfer_translations schema as migrate-transfers.mjs:
 *   id, slug, type, fromLocation, toLocation, priceFrom, currency,
 *   vehicleTypes, flightTracking, meetAndGreet, featured, active,
 *   sortOrder, imageUrl, createdAt, updatedAt
 *
 * Run: node --env-file=.env.local scripts/seed-morocco-routes.mjs
 */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// --- Marrakech Airport -> local zone transfers (type: AIRPORT) ---
const AIRPORT_LOCAL_ROUTES = [
  { slug: "rak-airport-to-gueliz",       from: "Marrakech Menara Airport (RAK)", to: "Guéliz",             priceFrom: 14 },
  { slug: "rak-airport-to-palmeraie",    from: "Marrakech Menara Airport (RAK)", to: "Palmeraie",          priceFrom: 15 },
  { slug: "rak-airport-to-targa",        from: "Marrakech Menara Airport (RAK)", to: "Targa",              priceFrom: 15 },
  { slug: "rak-airport-to-agdal",        from: "Marrakech Menara Airport (RAK)", to: "Agdal",              priceFrom: 15 },
  { slug: "rak-airport-to-medina",       from: "Marrakech Menara Airport (RAK)", to: "Medina",             priceFrom: 14 },
  { slug: "rak-airport-to-hivernage",    from: "Marrakech Menara Airport (RAK)", to: "Hivernage",          priceFrom: 14 },
  { slug: "rak-airport-to-city-center",  from: "Marrakech Menara Airport (RAK)", to: "City Center",        priceFrom: 14 },
];

// --- City-to-city routes (type: CITY_TO_CITY) ---
const CITY_TO_CITY_ROUTES = [
  { slug: "marrakech-to-casablanca",     from: "Marrakech", to: "Casablanca",             priceFrom: 125 },
  { slug: "marrakech-to-essaouira",      from: "Marrakech", to: "Essaouira",              priceFrom: 105 },
  { slug: "marrakech-to-agadir",         from: "Marrakech", to: "Agadir",                 priceFrom: 130 },
  { slug: "agadir-airport-to-marrakech", from: "Agadir Al Massira Airport (AGA)", to: "Marrakech", priceFrom: 135 },
  { slug: "marrakech-to-ouarzazate",     from: "Marrakech", to: "Ouarzazate",             priceFrom: 135 },
  { slug: "marrakech-to-zagora",         from: "Marrakech", to: "Zagora",                 priceFrom: 220 },
  { slug: "marrakech-to-merzouga",       from: "Marrakech", to: "Merzouga",               priceFrom: 320 },
  { slug: "marrakech-to-mhamid",         from: "Marrakech", to: "M'Hamid El Ghizlane",     priceFrom: 290 },
  { slug: "marrakech-to-rabat",          from: "Marrakech", to: "Rabat",                  priceFrom: 220 },
];

async function insertRoute(route, type) {
  const existing = await sql`SELECT id FROM transfers WHERE slug = ${route.slug}`;
  if (existing.length > 0) {
    console.log(`SKIP (exists): ${route.slug}`);
    return;
  }

  const now = new Date().toISOString();
  const title = `${route.from} to ${route.to} Transfer`;
  const description = `Private transfer from ${route.from} to ${route.to}. Fixed price, professional driver, door-to-door service.`;

  const rows = await sql`
    INSERT INTO transfers (
      id, slug, type, "fromLocation", "toLocation", "priceFrom", currency,
      "vehicleTypes", "flightTracking", "meetAndGreet",
      featured, active, "sortOrder", "imageUrl",
      "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid(),
      ${route.slug},
      ${type}::"TransferType",
      ${route.from},
      ${route.to},
      ${route.priceFrom},
      'EUR',
      '{}',
      ${type === 'AIRPORT'},
      ${type === 'AIRPORT'},
      false,
      true,
      0,
      '',
      ${now},
      ${now}
    )
    RETURNING id
  `;

  const transferId = rows[0].id;

  await sql`
    INSERT INTO transfer_translations (id, "transferId", locale, title, description)
    VALUES (gen_random_uuid(), ${transferId}, 'en', ${title}, ${description})
    ON CONFLICT DO NOTHING
  `;

  console.log(`ADDED [${type}]: ${route.slug} (from €${route.priceFrom}) — REVIEW PRICE BEFORE PUBLISHING`);
}

async function seed() {
  console.log("=== Seeding competitor-researched routes (reference pricing) ===\n");

  console.log("-- Airport local routes --");
  for (const route of AIRPORT_LOCAL_ROUTES) {
    await insertRoute(route, "AIRPORT");
  }

  console.log("\n-- City-to-city routes --");
  for (const route of CITY_TO_CITY_ROUTES) {
    await insertRoute(route, "INTER_CITY");
  }

  const xc = await sql`SELECT COUNT(*) as n FROM transfers`;
  console.log(`\n✓ transfers table now has ${xc[0].n} rows`);
  console.log("\nReminder: all priceFrom values above are competitor reference floors (their 1-3 pax tier).");
  console.log("Review each in the admin panel before making these routes active/public.");
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
