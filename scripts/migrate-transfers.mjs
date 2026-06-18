/**
 * migrate-transfers.mjs (v2 — fixed column names)
 *
 * Real transfers table schema:
 *   id, slug, type (TransferType enum), destinationId, fromLocation, toLocation,
 *   priceFrom (float), currency, vehicleTypes (array), flightTracking, meetAndGreet,
 *   featured, active, sortOrder, imageUrl, createdAt, updatedAt
 *
 * Run: node --env-file=.env.local scripts/migrate-transfers.mjs
 */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const TRANSFER_SLUGS = [
  "casablanca-mohammed-v-airport-transfer",
  "agadir-al-massira-airport-transfer",
  "tangier-ibn-battouta-airport-transfer",
  "fes-saiss-airport-transfer",
  "nador-el-aroui-airport-transfer",
  "marrakech-menara-airport-transfer",
];

const TRANSFER_DATA = {
  "marrakech-menara-airport-transfer":        { priceFrom: 17,  fromLocation: "Marrakech Menara Airport (RAK)" },
  "casablanca-mohammed-v-airport-transfer":   { priceFrom: 30,  fromLocation: "Casablanca Mohammed V Airport (CMN)" },
  "agadir-al-massira-airport-transfer":       { priceFrom: 20,  fromLocation: "Agadir Al Massira Airport (AGA)" },
  "tangier-ibn-battouta-airport-transfer":    { priceFrom: 25,  fromLocation: "Tangier Ibn Battouta Airport (TNG)" },
  "fes-saiss-airport-transfer":               { priceFrom: 22,  fromLocation: "Fes Saiss Airport (FEZ)" },
  "nador-el-aroui-airport-transfer":          { priceFrom: 28,  fromLocation: "Nador El Aroui Airport (NDR)" },
};

async function migrate() {
  console.log("=== Transfer Migration (v2) ===\n");

  const tourRows = await sql`
    SELECT t.id, t.slug, tt.title, tt.description
    FROM tours t
    LEFT JOIN tour_translations tt ON tt."tourId" = t.id AND tt.locale = 'en'
    WHERE t.slug = ANY(${TRANSFER_SLUGS})
  `;

  if (tourRows.length === 0) {
    console.log("No transfer rows found in tours table — already migrated.");
    return;
  }

  console.log(`Found ${tourRows.length} rows to migrate:\n`);
  tourRows.forEach(r => console.log(`  - ${r.slug}`));
  console.log("");

  const now = new Date().toISOString();

  for (const row of tourRows) {
    const extra = TRANSFER_DATA[row.slug] || { priceFrom: 0, fromLocation: "Morocco" };

    const existing = await sql`SELECT id FROM transfers WHERE slug = ${row.slug}`;
    if (existing.length > 0) {
      console.log(`SKIP (already in transfers): ${row.slug}`);
      continue;
    }

    await sql`
      INSERT INTO transfers (
        id, slug, type, "fromLocation", "priceFrom", currency,
        "vehicleTypes", "flightTracking", "meetAndGreet",
        featured, active, "sortOrder", "imageUrl",
        "createdAt", "updatedAt"
      ) VALUES (
        ${row.id},
        ${row.slug},
        'AIRPORT'::"TransferType",
        ${extra.fromLocation},
        ${extra.priceFrom},
        'EUR',
        '{}',
        true,
        true,
        false,
        true,
        0,
        '',
        ${now},
        ${now}
      )
    `;

    await sql`
      INSERT INTO transfer_translations (id, "transferId", locale, title, description)
      VALUES (
        gen_random_uuid(),
        ${row.id},
        'en',
        ${row.title || extra.fromLocation + " Transfer"},
        ${row.description || "Professional airport transfer with experienced drivers."}
      )
      ON CONFLICT DO NOTHING
    `;

    console.log(`MIGRATED: ${row.slug} → transfers (€${extra.priceFrom})`);
  }

  console.log("\nRemoving from tours table...");

  const del_tt = await sql`
    DELETE FROM tour_translations
    WHERE "tourId" IN (SELECT id FROM tours WHERE slug = ANY(${TRANSFER_SLUGS}))
    RETURNING "tourId"
  `;
  console.log(`  Deleted ${del_tt.length} tour_translation rows`);

  const del_t = await sql`
    DELETE FROM tours WHERE slug = ANY(${TRANSFER_SLUGS})
    RETURNING slug
  `;
  console.log(`  Deleted ${del_t.length} tour rows`);

  const tc = await sql`SELECT COUNT(*) as n FROM tours`;
  const xc = await sql`SELECT COUNT(*) as n FROM transfers`;
  console.log(`\n✓ tours: ${tc[0].n} rows`);
  console.log(`✓ transfers: ${xc[0].n} rows`);
  console.log("\nDone.");
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
