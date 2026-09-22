/* ============================================================
   Доступ к Supabase.

   Работает без зависимостей — через обычный fetch к REST-API.
   Это осознанно: пакет @supabase/supabase-js тянет за собой немало,
   а нам пока нужны две операции — вставить заявку и прочитать список.

   Если переменные окружения не заданы, функции возвращают null или
   пустой список, и сайт продолжает работать на статических данных.
   То есть Supabase можно подключить в любой момент, ничего не ломая.
   ============================================================ */

const URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseReady(): boolean {
  return Boolean(URL && SERVICE_KEY);
}

type Json = Record<string, unknown>;

async function request(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<Response> {
  if (!URL || !SERVICE_KEY) throw new Error('Supabase is not configured');

  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

/** Вставка строки. Возвращает созданную запись или null, если БД не подключена. */
export async function insert<T extends Json>(table: string, row: T): Promise<Json | null> {
  if (!isSupabaseReady()) return null;

  const res = await request(table, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    throw new Error(`Supabase insert ${table}: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as Json[];
  return data[0] ?? null;
}

/** Выборка. query — строка параметров PostgREST, например 'order=created_at.desc&limit=50'. */
export async function select<T>(table: string, query = ''): Promise<T[]> {
  if (!isSupabaseReady()) return [];

  const res = await request(`${table}${query ? `?${query}` : ''}`);
  if (!res.ok) {
    throw new Error(`Supabase select ${table}: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T[];
}

/** Обновление по id. */
export async function update(table: string, id: string, patch: Json): Promise<void> {
  if (!isSupabaseReady()) return;

  const res = await request(`${table}?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`Supabase update ${table}: ${res.status} ${await res.text()}`);
  }
}
