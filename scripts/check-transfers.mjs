import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const r = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='transfers' ORDER BY ordinal_position`;
r.forEach(c => console.log(c.column_name.padEnd(25), c.data_type));
