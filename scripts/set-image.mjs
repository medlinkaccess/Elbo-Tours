import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
await sql`UPDATE tours SET "imageUrl" = '/images/tours/grand-maroc.jpg' WHERE slug = 'grand-maroc'`;
console.log("done");
