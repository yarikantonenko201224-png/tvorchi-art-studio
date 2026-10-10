/* ============================================================
   Доступ к Supabase.

   Работает без зависимостей — через обычный fetch к REST-API
   (база) и Storage-API (файлы). Пакет @supabase/supabase-js тянет
   за собой немало, а нам нужны простые операции.

   Если переменные окружения не заданы, функции возвращают null или
   пустой список, и сайт продолжает работать на статических данных.
   То есть Supabase можно подключить в любой момент, ничего не ломая.

   Этот модуль — только для сервера: в нём сервисный ключ.
   ============================================================ */

const URL = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Бакет для всех картинок, которые студия загружает через админку. */
export const MEDIA_BUCKET = 'media';

/** Тег кэша для публичных страниц: админка сбрасывает его после правок. */
export const CONTENT_TAG = 'content';

export function isSupabaseReady(): boolean {
  return Boolean(URL && SERVICE_KEY);
}

type Json = Record<string, unknown>;

function authHeaders(): Record<string, string> {
  if (!SERVICE_KEY) return {};
  return {
    apikey: SERVICE_KEY,
    /* Старый service_role — это JWT (начинается с eyJ) и идёт ещё и в Authorization.
       Новый секретный ключ sb_secret_… — не JWT, ему достаточно заголовка apikey. */
    ...(SERVICE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SERVICE_KEY}` } : {}),
  };
}

async function request(
  path: string,
  init: RequestInit & { headers?: Record<string, string>; next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<Response> {
  if (!URL || !SERVICE_KEY) throw new Error('Supabase is not configured');

  return fetch(`${URL}/rest/v1/${path}`, {
    cache: init.next ? undefined : 'no-store',
    ...init,
    headers: {
      ...authHeaders(),
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

/** Вставка или замена по первичному ключу (для фото мастер-классов: ключ — slug). */
export async function upsert<T extends Json>(table: string, row: T): Promise<void> {
  if (!isSupabaseReady()) return;

  const res = await request(table, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`Supabase upsert ${table}: ${res.status} ${await res.text()}`);
  }
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

/** Выборка для публичных страниц: кэшируется на минуту и сбрасывается из админки. */
export async function selectCached<T>(table: string, query = '', revalidate = 60): Promise<T[]> {
  if (!isSupabaseReady()) return [];

  const res = await request(`${table}${query ? `?${query}` : ''}`, {
    next: { revalidate, tags: [CONTENT_TAG] },
  });
  if (!res.ok) {
    throw new Error(`Supabase select ${table}: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T[];
}

/** Обновление по значению ключевой колонки (по умолчанию id). */
export async function update(table: string, id: string, patch: Json, key = 'id'): Promise<void> {
  if (!isSupabaseReady()) return;

  const res = await request(`${table}?${key}=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`Supabase update ${table}: ${res.status} ${await res.text()}`);
  }
}

/** Удаление по значению ключевой колонки (по умолчанию id). */
export async function remove(table: string, id: string, key = 'id'): Promise<void> {
  if (!isSupabaseReady()) return;

  const res = await request(`${table}?${key}=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Supabase delete ${table}: ${res.status} ${await res.text()}`);
  }
}

/* ---------------- Файлы ---------------- */

/** Публичная ссылка на файл из бакета media. Бакет публичный — ключ не нужен. */
export function publicUrl(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith('/')) return path;
  return `${URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

/** Загрузка файла в бакет media. path — например 'gallery/2b1c….jpg'. */
export async function uploadFile(path: string, body: ArrayBuffer, contentType: string): Promise<void> {
  if (!URL || !SERVICE_KEY) throw new Error('Supabase is not configured');

  const res = await fetch(`${URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      ...authHeaders(),
      'Content-Type': contentType,
      'Cache-Control': 'max-age=31536000',
      'x-upsert': 'true',
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Supabase upload ${path}: ${res.status} ${await res.text()}`);
  }
}

/** Удаление файла. Ошибку только логируем: строка в базе важнее, чем «осиротевший» файл. */
export async function deleteFile(path: string | null | undefined): Promise<void> {
  if (!path || !URL || !SERVICE_KEY || path.startsWith('/') || /^https?:/.test(path)) return;

  try {
    const res = await fetch(`${URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: authHeaders(),
    });
    if (!res.ok) console.error('[storage] delete', path, res.status, await res.text());
  } catch (error) {
    console.error('[storage] delete', path, error);
  }
}
