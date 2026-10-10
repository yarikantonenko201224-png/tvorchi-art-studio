import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { guard, bad, fail } from '@/lib/admin-api';
import { uploadFile, publicUrl } from '@/lib/supabase';

/* Загрузка картинки в хранилище.
   Браузер админки заранее уменьшает фото до 1600 px (см. lib/resize-image.ts),
   поэтому сюда приходит ~300–600 КБ, а не 5 МБ с телефона. */

const FOLDERS = ['gallery', 'announcements', 'mk'] as const;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_BYTES = 4 * 1024 * 1024; // лимит тела запроса на Vercel — 4,5 МБ

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad('Файл не дійшов. Спробуйте ще раз.');
  }

  const file = form.get('file');
  const folder = String(form.get('folder') ?? '');
  if (!(file instanceof Blob)) return bad('Оберіть фото');
  if (!FOLDERS.includes(folder as (typeof FOLDERS)[number])) return bad('Невідома папка');

  const ext = TYPES[file.type];
  if (!ext) return bad('Підтримуються JPG, PNG і WebP');
  if (file.size > MAX_BYTES) return bad('Фото завелике — до 4 МБ');

  const path = `${folder}/${randomUUID()}.${ext}`;
  try {
    await uploadFile(path, await file.arrayBuffer(), file.type);
    return NextResponse.json({ path, url: publicUrl(path) });
  } catch (error) {
    return fail(error, 'upload');
  }
}
