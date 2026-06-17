import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

// Simple SHA-256 hash (no bcrypt dependency needed)
function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

// POST /api/auth â€” login
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Check DB first, fallback to env var for backwards compat
    const adminUser = await prisma.adminUser.findFirst()

    let isValid = false

    if (adminUser) {
      isValid = adminUser.passwordHash === hashPassword(password)
      if (isValid) {
        await prisma.adminUser.update({
          where: { id: adminUser.id },
          data: { lastLoginAt: new Date() },
        })
      }
    } else {
      // Fallback: compare against ADMIN_PASSWORD env var (plain text, for migration period)
      isValid = password === process.env.ADMIN_PASSWORD
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch (err) {
    console.error('POST /api/auth', err)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}

// DELETE /api/auth â€” logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_auth', '', { maxAge: 0, path: '/' })
  return res
}

