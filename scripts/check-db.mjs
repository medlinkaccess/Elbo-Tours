import { neon } from "@neondatabase/serverless";
import "dotenv/config";
const sql = neon(process.env.DATABASE_URL);

const tours = await sql`SELECT id, slug, category, "priceFrom", active FROM tours ORDER BY "createdAt"`;
console.log("=== TOURS TABLE ===");
console.log(`Row count: ${tours.length}`);
tours.forEach(t => console.log(JSON.stringify(t)));

const translations = await sql`SELECT "tourId", locale, title FROM tour_translations`;
console.log("\n=== TRANSLATIONS ===");
console.log(`Row count: ${translations.length}`);
translations.forEach(t => console.log(JSON.stringify(t)));
