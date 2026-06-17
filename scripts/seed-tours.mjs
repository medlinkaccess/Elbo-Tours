import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import * as dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)
const tours = JSON.parse(readFileSync('./data/tours.json', 'utf8'))

// Map your JSON categories to the DB enum
const categoryMap = {
  'Multi-day Tours': 'MULTI_DAY',
  'Day Trips': 'DAY_TRIP',
  'Desert Tours': 'DESERT',
  'City Tours': 'CITY',
  'Transfers': 'TRANSFER',
}

for (const tour of tours) {
  const tourId = randomUUID()

  // Parse price — if not a number, default to 0
  const priceFrom = parseFloat(tour.price) || 0

  // Parse duration days — extract first number found
  const durationMatch = tour.duration?.match(/\d+/)
  const durationDays = durationMatch ? parseInt(durationMatch[0]) : 1

  const category = categoryMap[tour.category] ?? 'DAY_TRIP'

  // Insert into tours
  await sql.query(
    `INSERT INTO tours (id, slug, category, "priceFrom", currency, "durationDays", "durationText", "maxGroupSize", "minGroupSize", featured, active, "sortOrder", "imageUrl", gallery, "createdAt", "updatedAt")
     VALUES ($1,$2,$3::\"TourCategory\",$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT (slug) DO NOTHING`,
    [
      tourId,
      tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category,
      priceFrom,
      'USD',
      durationDays,
      tour.duration ?? '',
      12,
      1,
      tour.featured ?? false,
      true,
      parseInt(tour.id) || 0,
      tour.image ?? '',
      '{}',
      tour.createdAt ?? new Date().toISOString(),
      new Date().toISOString(),
    ]
  )

  // Insert English translation
  await sql.query(
    `INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
     VALUES ($1,$2,$3::\"Locale\",$4,$5,$6,$7,$8)`,
    [
      randomUUID(),
      tourId,
      'en',
      tour.title,
      tour.desc ?? '',
      '',
      tour.title,
      tour.desc?.slice(0, 160) ?? '',
    ]
  )

  console.log('Inserted:', tour.title)
}

console.log('Done —', tours.length, 'tours seeded')