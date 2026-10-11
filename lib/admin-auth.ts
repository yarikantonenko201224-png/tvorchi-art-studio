import { cookies, headers } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

/* Защита админки.

   Один общий пароль из переменной окружения: пользователей двое, а полноценная
   авторизация с ролями сейчас задержала бы запуск. Когда появятся педагоги
   со своими доступами, меняется только этот модуль.

   В куке лежит не пароль, а HMAC от него с серверным секретом
   (ADMIN_SESSION_SECRET, а если его нет — ключ Supabase, который тоже есть
   только на сервере). Из куки пароль не достать, а подделать куку
   без серверного секрета нельзя. Сменили пароль — все старые входы
   перестают работать. */

const COOKIE = 'tvorchi_admin';

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'tvorchi-local';
}

function tokenFor(password: string): string {
  return createHmac('sha256', secret()).update(`tvorchi-admin:${password}`).digest('hex');
}

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password ? tokenFor(password) : null;
}

function safeEqual(a: string, b: string): boolean {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export function checkPassword(input: string): string | null {
  const token = expectedToken();
  if (!token || !input) return null;
  return safeEqual(tokenFor(input), token) ? token : null;
}

export async function isAuthorized(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, token);
}

export const ADMIN_COOKIE = COOKIE;

/** Пароль вообще задан? Если нет — админка честно говорит, что не настроена. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Запрос пришёл с нашего же сайта? Защита от подделки запросов с чужих страниц (CSRF). */
export async function isSameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get('origin');
  if (!origin) return true; // браузеры шлют Origin на POST; его нет только у серверных клиентов без кук
  try {
    return new URL(origin).host === (h.get('x-forwarded-host') ?? h.get('host'));
  } catch {
    return false;
  }
}

/* Ограничение попыток входа: 5 ошибок за 15 минут с одного адреса.
   Хранится в памяти функции: простой, но заметный барьер для перебора. */
const fails = new Map<string, number[]>();
export function loginBlocked(ip: string): boolean {
  const now = Date.now();
  const list = (fails.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
  fails.set(ip, list);
  return list.length >= 5;
}
export function loginFailed(ip: string): void {
  fails.set(ip, [...(fails.get(ip) ?? []), Date.now()]);
}
export function clientIp(h: Headers): string {
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
