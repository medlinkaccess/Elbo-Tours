import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
await sql`UPDATE tours SET "imageUrl" = '/images/tours/classic-morocco.jpg' WHERE slug = 'classic-morocco'`;
console.log("done");
