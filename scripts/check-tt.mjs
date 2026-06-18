import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const r = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='transfer_translations' ORDER BY ordinal_position`;
r.forEach(c => console.log(c.column_name));
