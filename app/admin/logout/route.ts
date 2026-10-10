import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/admin', new URL(request.url).origin), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
