import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS quote_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tour_id TEXT REFERENCES tours(id) ON DELETE SET NULL,
    tour_title TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    travel_date TEXT NOT NULL DEFAULT '',
    group_size INT NOT NULL DEFAULT 1,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log("OK: quote_requests table created");
