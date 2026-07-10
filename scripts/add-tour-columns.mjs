/**
 * add-tour-columns.mjs
 * 
 * Adds missing columns to the tours table:
 *   - tags        TEXT[]  DEFAULT '{}'
 *   - "departsFrom" TEXT    DEFAULT ''
 * 
 * Also adds priceDisplay TEXT to handle "Ask for price" / "From €17" labels
 * without clobbering the numeric priceFrom column.
 * 
 * Safe to re-run — uses IF NOT EXISTS guards.
 * Run: node --env-file=.env.local scripts/add-tour-columns.mjs
 */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log("=== Adding missing columns to tours ===\n");

  const alterations = [
    {
      label: 'tags TEXT[] DEFAULT \'{}\'',
      sql: `ALTER TABLE tours ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`,
    },
    {
      label: '"departsFrom" TEXT DEFAULT \'\'',
      sql: `ALTER TABLE tours ADD COLUMN IF NOT EXISTS "departsFrom" TEXT DEFAULT ''`,
    },
    {
      label: '"priceDisplay" TEXT DEFAULT \'\'',
      sql: `ALTER TABLE tours ADD COLUMN IF NOT EXISTS "priceDisplay" TEXT DEFAULT ''`,
    },
  ];

  for (const alt of alterations) {
    try {
      await sql.query(alt.sql);
      console.log(`✓ Added: ${alt.label}`);
    } catch (err) {
      console.error(`✗ Failed: ${alt.label}\n  ${err.message}`);
    }
  }

  // Verify columns exist
  const cols = await sql`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'tours'
    ORDER BY ordinal_position
  `;
  console.log("\n=== Current tours columns ===");
  cols.forEach(c => console.log(`  ${c.column_name.padEnd(20)} ${c.data_type}`));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
