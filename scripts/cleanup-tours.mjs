import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

await sql`UPDATE tours SET "imageUrl" = '/images/tours/classic-morocco.jpg' WHERE slug = 'classic-morocco'`;
console.log("✓ classic-morocco image set");

await sql`DELETE FROM tour_highlights WHERE "tourId" = (SELECT id FROM tours WHERE slug = 'grand-morocco-tour')`;
await sql`DELETE FROM tour_inclusions WHERE "tourId" = (SELECT id FROM tours WHERE slug = 'grand-morocco-tour')`;
await sql`DELETE FROM tour_translations WHERE "tourId" = (SELECT id FROM tours WHERE slug = 'grand-morocco-tour')`;
await sql`DELETE FROM tours WHERE slug = 'grand-morocco-tour'`;
console.log("✓ grand-morocco-tour deleted");

const rows = await sql`SELECT slug FROM tours ORDER BY "sortOrder"`;
rows.forEach(r => console.log(" ", r.slug));
