import { NextResponse } from 'next/server';
import { createLead, type LeadInput, type LeadSource } from '@/lib/leads';

/* Приём заявок со всех форм сайта.

   Антиспам без капчи: скрытое поле-ловушка и ограничение частоты по IP.
   Капчу сознательно не ставим — она сильнее бьёт по конверсии,
   чем спам по студии в Кременчуці. */

const SOURCES: LeadSource[] = ['trial', 'masterclass', 'birthday', 'certificate', 'quiz', 'camp', 'party', 'trip'];

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

/* Свободные поля формы (payload) кладём в базу и в Telegram, поэтому
   держим их маленькими и плоскими: до 25 ключей, только строки/числа/логические. */
function cleanPayload(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value).slice(0, 25)) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,39}$/.test(k)) continue;
    if (typeof v === 'string') out[k] = v.slice(0, 300);
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function intIn(value: unknown, min: number, max: number): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? value : undefined;
}

function digits(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\D/g, '') : '';
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // заявка весит пару сотен байт; всё, что больше 16 КБ, — не форма сайта
  if (Number(request.headers.get('content-length') ?? 0) > 16_384) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

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
    childAge: intIn(body.childAge, 1, 99),
    parentName: typeof body.parentName === 'string' ? body.parentName.slice(0, 80) : undefined,
    email: typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ? body.email.trim().slice(0, 120) : undefined,
    direction: typeof body.direction === 'string' ? body.direction.slice(0, 120) : undefined,
    lessonId: typeof body.lessonId === 'string' ? body.lessonId.slice(0, 40) : undefined,
    people: intIn(body.people, 1, 200),
    amount: intIn(body.amount, 0, 200_000),
    payload: cleanPayload(body.payload),
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
