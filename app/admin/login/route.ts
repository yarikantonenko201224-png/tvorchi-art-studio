import { NextResponse } from 'next/server';
import { checkPassword, ADMIN_COOKIE, isSameOrigin, loginBlocked, loginFailed, clientIp } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const back = (q: string) => NextResponse.redirect(new URL(`/admin?${q}`, url.origin), { status: 303 });

  if (!(await isSameOrigin())) return back('error=1');
  const ip = clientIp(request.headers);
  if (loginBlocked(ip)) return back('error=locked');

  const form = await request.formData();
  const password = String(form.get('password') ?? '').slice(0, 200);
  const token = checkPassword(password);

  if (!token) {
    loginFailed(ip);
    await new Promise((r) => setTimeout(r, 600)); // замедляем перебор
    return back('error=1');
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
