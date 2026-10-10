import { NextResponse } from 'next/server';
import { guard, bad, fail, refreshSite, text } from '@/lib/admin-api';
import { insert, select, update, remove, deleteFile } from '@/lib/supabase';
import type { GalleryRow } from '@/lib/content';

/* Галерея работ.
   POST   { image_path, caption? }            — добавить (новое встаёт первым)
   PATCH  { id, caption?, on_home?, active? } — изменить
   PATCH  { order: [id, id, …] }              — новый порядок
   DELETE ?id=…                               — удалить вместе с файлом */

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;
  const imagePath = text(body.image_path, 200);
  if (!imagePath || !imagePath.startsWith('gallery/')) return bad('Немає фото');

  try {
    const first = await select<GalleryRow>('gallery_items', 'select=sort&order=sort.asc&limit=1');
    const sort = first.length ? first[0].sort - 1 : 0;
    const row = await insert('gallery_items', {
      image_path: imagePath,
      caption: text(body.caption, 80),
      sort,
      on_home: true,
      active: true,
    });
    refreshSite();
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    return fail(error, 'gallery POST');
  }
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;

  try {
    if (Array.isArray(body.order)) {
      const ids = body.order.filter((v): v is string => typeof v === 'string').slice(0, 500);
      await Promise.all(ids.map((id, i) => update('gallery_items', id, { sort: i })));
      refreshSite();
      return NextResponse.json({ ok: true });
    }

    const id = text(body.id, 60);
    if (!id) return bad('Немає id');

    const patch: Record<string, unknown> = {};
    if ('caption' in body) patch.caption = text(body.caption, 80);
    if (typeof body.on_home === 'boolean') patch.on_home = body.on_home;
    if (typeof body.active === 'boolean') patch.active = body.active;
    if (!Object.keys(patch).length) return bad('Нічого змінювати');

    await update('gallery_items', id, patch);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'gallery PATCH');
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return bad('Немає id');

  try {
    const rows = await select<GalleryRow>('gallery_items', `id=eq.${encodeURIComponent(id)}&select=image_path`);
    await remove('gallery_items', id);
    await deleteFile(rows[0]?.image_path);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'gallery DELETE');
  }
}
