import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT slug, "imageUrl" FROM transfers ORDER BY "sortOrder"`;
console.log(JSON.stringify(rows, null, 2));
