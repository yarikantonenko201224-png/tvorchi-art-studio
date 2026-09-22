import { NextResponse } from 'next/server';
import { createLead, type LeadInput, type LeadSource } from '@/lib/leads';

/* Приём заявок со всех форм сайта.

   Антиспам без капчи: скрытое поле-ловушка и ограничение частоты по IP.
   Капчу сознательно не ставим — она сильнее бьёт по конверсии,
   чем спам по студии в Кременчуці. */

const SOURCES: LeadSource[] = ['trial', 'masterclass', 'birthday', 'certificate', 'quiz'];

/* Примитивный лимит в памяти процесса. Для одной студии этого достаточно;
   при росте нагрузки переедет в Supabase или Upstash. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

function digits(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\D/g, '') : '';
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  /* Ловушка: поле скрыто от людей, но заполняется ботами.
     Отвечаем успехом, чтобы бот не подбирал обход. */
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const source = body.source as LeadSource;
  if (!SOURCES.includes(source)) {
    return NextResponse.json({ error: 'bad_source' }, { status: 400 });
  }

  const phone = digits(body.phone);
  if (phone.length !== 12) {
    return NextResponse.json({ error: 'bad_phone' }, { status: 400 });
  }

  const input: LeadInput = {
    source,
    phone: `+${phone}`,
    childName: typeof body.childName === 'string' ? body.childName.slice(0, 80) : undefined,
    childAge: typeof body.childAge === 'number' ? body.childAge : undefined,
    parentName: typeof body.parentName === 'string' ? body.parentName.slice(0, 80) : undefined,
    email: typeof body.email === 'string' ? body.email.slice(0, 120) : undefined,
    direction: typeof body.direction === 'string' ? body.direction.slice(0, 120) : undefined,
    lessonId: typeof body.lessonId === 'string' ? body.lessonId.slice(0, 40) : undefined,
    people: typeof body.people === 'number' ? body.people : undefined,
    amount: typeof body.amount === 'number' ? body.amount : undefined,
    payload: typeof body.payload === 'object' && body.payload !== null
      ? (body.payload as Record<string, unknown>)
      : undefined,
  };

  try {
    const result = await createLead(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/leads]', error);
    /* Пользователю не показываем сбой: заявка для него важнее нашей телеметрии.
       Администратор увидит ошибку в логах Vercel. */
    return NextResponse.json({ ok: true, stored: false });
  }
}
