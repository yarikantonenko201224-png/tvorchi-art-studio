import { NextResponse } from 'next/server';
import { guard, bad, fail, refreshSite, text } from '@/lib/admin-api';
import { select, upsert, remove, deleteFile } from '@/lib/supabase';
import type { MasterclassPhotoRow } from '@/lib/content';
import { MASTER_CLASSES } from '@/lib/data';

/* Фото мастер-классов: одно фото на мастер-класс.
   PUT    { slug, image_path } — поставить или заменить (старый файл удаляется)
   DELETE ?slug=…             — убрать загруженное (вернётся фото из кода или клякса) */

const SLUGS = new Set(MASTER_CLASSES.map((m) => m.slug));

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;
  const slug = text(body.slug, 80);
  const imagePath = text(body.image_path, 200);
  if (!slug || !SLUGS.has(slug)) return bad('Невідомий майстер-клас');
  if (!imagePath || !imagePath.startsWith('mk/')) return bad('Немає фото');

  try {
    const old = await select<MasterclassPhotoRow>('masterclass_photos', `slug=eq.${encodeURIComponent(slug)}`);
    await upsert('masterclass_photos', { slug, image_path: imagePath, updated_at: new Date().toISOString() });
    if (old[0] && old[0].image_path !== imagePath) await deleteFile(old[0].image_path);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'mk-photos PUT');
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return bad('Немає slug');

  try {
    const old = await select<MasterclassPhotoRow>('masterclass_photos', `slug=eq.${encodeURIComponent(slug)}`);
    await remove('masterclass_photos', slug, 'slug');
    await deleteFile(old[0]?.image_path);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'mk-photos DELETE');
  }
}
