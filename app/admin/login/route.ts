import { NextResponse } from 'next/server';
import { checkPassword, ADMIN_COOKIE } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  const token = checkPassword(password);
  const url = new URL(request.url);

  if (!token) {
    return NextResponse.redirect(new URL('/admin?error=1', url.origin), { status: 303 });
  }

  const res = NextResponse.redirect(new URL('/admin', url.origin), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
