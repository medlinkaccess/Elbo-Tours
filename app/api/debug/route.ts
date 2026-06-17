import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const tables = await sql.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`, [])
    return NextResponse.json({ tables })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
