import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT slug, "imageUrl" FROM tours ORDER BY "sortOrder"`;
rows.forEach(r => console.log(r.slug.padEnd(40), r.imageUrl || "(empty)"));
