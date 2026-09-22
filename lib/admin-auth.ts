import { cookies } from 'next/headers';
import { createHash } from 'crypto';

/* Защита админки.

   Пока это один общий пароль из переменной окружения, а не полноценная
   авторизация. Сознательный компромисс: пользователей двое, а Supabase Auth
   с ролями — это отдельная работа, которая сейчас задержала бы запуск.
   Когда появятся педагоги со своими доступами, меняется только этот модуль.

   В куке лежит не пароль, а его хеш вместе с секретом сервера —
   даже если кука утечёт, пароль из неё не достать. */

const COOKIE = 'tvorchi_admin';

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(`tvorchi:${password}`).digest('hex');
}

export function checkPassword(input: string): string | null {
  const token = expectedToken();
  if (!token) return null;
  const candidate = createHash('sha256').update(`tvorchi:${input}`).digest('hex');
  return candidate === token ? token : null;
}

export async function isAuthorized(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token;
}

export const ADMIN_COOKIE = COOKIE;

/** Пароль вообще задан? Если нет — админка честно говорит, что не настроена. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
