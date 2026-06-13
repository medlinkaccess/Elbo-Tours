import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'elbo2025'; // Change this!

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return res;
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_auth');
  return res;
}
