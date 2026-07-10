import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Load DATABASE_URL from .env.local manually (no dotenv dependency needed)
const env = readFileSync('.env.local', 'utf8');
const match = env.match(/^DATABASE_URL=(.+)$/m);
const sql = neon(match[1].trim());

async function main() {
  console.log('=== TOURS TABLE COLUMNS ===');
  const tourCols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tours'
    ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(tourCols, null, 2));

  console.log('\n=== TOUR_TRANSLATIONS TABLE COLUMNS ===');
  const ttCols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tour_translations'
    ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(ttCols, null, 2));

  console.log('\n=== TOUR_HIGHLIGHTS TABLE COLUMNS ===');
  const thCols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tour_highlights'
    ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(thCols, null, 2));

  console.log('\n=== TOUR_INCLUSIONS TABLE COLUMNS ===');
  const tiCols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'tour_inclusions'
    ORDER BY ordinal_position
  `;
  console.log(JSON.stringify(tiCols, null, 2));

  console.log('\n=== CLASSIC MOROCCO: tours row ===');
  const tour = await sql`SELECT * FROM tours WHERE slug = 'classic-morocco'`;
  console.log(JSON.stringify(tour, null, 2));

  if (tour.length > 0) {
    const id = tour[0].id;

    console.log('\n=== CLASSIC MOROCCO: tour_translations rows ===');
    const trans = await sql`SELECT * FROM tour_translations WHERE "tourId" = ${id}`;
    console.log(JSON.stringify(trans, null, 2));

    console.log('\n=== CLASSIC MOROCCO: tour_highlights rows ===');
    const hl = await sql`SELECT * FROM tour_highlights WHERE "tourId" = ${id}`;
    console.log(JSON.stringify(hl, null, 2));

    console.log('\n=== CLASSIC MOROCCO: tour_inclusions rows ===');
    const inc = await sql`SELECT * FROM tour_inclusions WHERE "tourId" = ${id}`;
    console.log(JSON.stringify(inc, null, 2));
  }

  console.log('\n=== TRANSFERS: rows missing an english translation (the "title missing" bug) ===');
  const missing = await sql`
    SELECT t.id, t.slug, t."fromLocation"
    FROM transfers t
    LEFT JOIN transfer_translations tt ON tt."transferId" = t.id AND tt.locale = 'en'
    WHERE tt.id IS NULL
  `;
  console.log(JSON.stringify(missing, null, 2));
}

main().catch(err => { console.error('ERROR:', err); process.exit(1); });
