import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAuthorized, isSameOrigin } from './admin-auth';
import { isSupabaseReady, CONTENT_TAG } from './supabase';

/* Общие проверки для всех /api/admin/*.
   Без входа в админку и без подключённой базы ничего менять нельзя. */
export async function guard(): Promise<NextResponse | null> {
  if (!(await isSameOrigin())) {
    return NextResponse.json({ error: 'Запит з іншого сайту відхилено' }, { status: 403 });
  }
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Потрібно увійти в адмінку' }, { status: 401 });
  }
  if (!isSupabaseReady()) {
    return NextResponse.json({ error: 'База даних не підключена' }, { status: 503 });
  }
  return null;
}

/** После любой правки контента — сразу показать её на сайте, не дожидаясь кэша. */
export function refreshSite(): void {
  revalidateTag(CONTENT_TAG);
}

export function fail(error: unknown, where: string): NextResponse {
  console.error(`[admin] ${where}`, error);
  return NextResponse.json({ error: 'Не вдалося зберегти. Спробуйте ще раз.' }, { status: 500 });
}

export function bad(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Обрезка строки из формы: пустое → null. */
export function text(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim().slice(0, max);
  return t === '' ? null : t;
}
