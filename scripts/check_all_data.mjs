import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/^DATABASE_URL=(.+)$/m);
const sql = neon(match[1].trim());

async function main() {
  console.log('=== ALL TABLES IN DATABASE ===');
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log(JSON.stringify(tables.map(t => t.table_name), null, 2));

  console.log('\n=== ALL TOURS (core fields) ===');
  const tours = await sql`
    SELECT id, slug, category, "priceFrom", "priceDisplay", "durationDays", "durationText",
           "maxGroupSize", "minGroupSize", featured, active, "imageUrl", gallery, tags, "departsFrom"
    FROM tours ORDER BY "sortOrder"
  `;
  console.log(JSON.stringify(tours, null, 2));

  console.log('\n=== PER-TOUR DATA COMPLETENESS ===');
  for (const t of tours) {
    const trans = await sql`SELECT locale, length(title) as title_len, length(description) as desc_len, itinerary IS NOT NULL as has_itinerary, "metaTitle" IS NOT NULL as has_meta FROM tour_translations WHERE "tourId" = ${t.id}`;
    const hl = await sql`SELECT locale, count(*) as n FROM tour_highlights WHERE "tourId" = ${t.id} GROUP BY locale`;
    const inc = await sql`SELECT locale, included, count(*) as n FROM tour_inclusions WHERE "tourId" = ${t.id} GROUP BY locale, included`;
    console.log(`\n--- ${t.slug} ---`);
    console.log('translations:', JSON.stringify(trans));
    console.log('highlights:', JSON.stringify(hl));
    console.log('inclusions:', JSON.stringify(inc));
  }

  console.log('\n=== DESTINATIONS TABLE (if exists) ===');
  try {
    const dest = await sql`SELECT * FROM destinations LIMIT 20`;
    console.log(JSON.stringify(dest, null, 2));
  } catch (e) {
    console.log('No destinations table or error:', e.message);
  }

  console.log('\n=== FLEET TABLE COLUMNS ===');
  const fleetCols = await sql`
    SELECT column_name, data_type, is_nullable FROM information_schema.columns
    WHERE table_name = 'fleet' ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(fleetCols, null, 2));

  console.log('\n=== BLOGS TABLE COLUMNS ===');
  const blogCols = await sql`
    SELECT column_name, data_type, is_nullable FROM information_schema.columns
    WHERE table_name = 'blogs' ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(blogCols, null, 2));

  console.log('\n=== TRANSFERS TABLE COLUMNS ===');
  const transferCols = await sql`
    SELECT column_name, data_type, is_nullable FROM information_schema.columns
    WHERE table_name = 'transfers' ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(transferCols, null, 2));
}

main().catch(err => { console.error('ERROR:', err); process.exit(1); });
