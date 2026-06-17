import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const enums = await sql.query(`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'TourCategory'`, [])
    const sample = await sql.query(`SELECT id, category, active FROM tours LIMIT 5`, [])
    return NextResponse.json({ enums, sample })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
