import { NextResponse } from 'next/server';
import { guard, bad, fail, refreshSite, text } from '@/lib/admin-api';
import { insert, select, update, remove, deleteFile } from '@/lib/supabase';
import { kyivLocalToISO, type AnnouncementRow } from '@/lib/content';

/* Анонсы.
   POST   { id?, title, starts_at, ends_at?, … } — создать или (с id) изменить.
          Даты приходят как «2026-09-20T13:00» — киевское время из поля формы.
   PATCH  { id, active }                       — показать / сховати
   DELETE ?id=…                                — удалить вместе с афишей */

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;
  const title = text(body.title, 120);
  const startsAt = kyivLocalToISO(String(body.starts_at ?? ''));
  const endsRaw = text(body.ends_at, 20);
  const endsAt = endsRaw ? kyivLocalToISO(endsRaw) : null;

  if (!title) return bad('Вкажіть назву події');
  if (!startsAt) return bad('Вкажіть дату й час початку');
  if (endsRaw && !endsAt) return bad('Невірна дата завершення');
  if (endsAt && endsAt < startsAt) return bad('Завершення раніше за початок');

  const seatsRaw = body.seats;
  const seats =
    seatsRaw === '' || seatsRaw === null || seatsRaw === undefined
      ? null
      : Math.max(0, Math.min(999, Number(seatsRaw) || 0));

  const coverPath = text(body.cover_path, 200);
  if (coverPath && !coverPath.startsWith('announcements/')) return bad('Невірна афіша');

  const row = {
    title,
    starts_at: startsAt,
    ends_at: endsAt,
    cover_path: coverPath,
    place: text(body.place, 120),
    age: text(body.age, 60),
    short: text(body.short, 300),
    full_text: text(body.full_text, 3000),
    price: text(body.price, 120),
    seats,
    link: text(body.link, 300),
    active: body.active === false ? false : true,
  };

  try {
    const id = text(body.id, 60);
    if (id) {
      const old = await select<AnnouncementRow>('announcements', `id=eq.${encodeURIComponent(id)}&select=cover_path`);
      await update('announcements', id, row);
      if (old[0]?.cover_path && old[0].cover_path !== coverPath) await deleteFile(old[0].cover_path);
    } else {
      await insert('announcements', row);
    }
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'announcements POST');
  }
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;
  const id = text(body.id, 60);
  if (!id || typeof body.active !== 'boolean') return bad('Невірний запит');

  try {
    await update('announcements', id, { active: body.active });
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'announcements PATCH');
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return bad('Немає id');

  try {
    const old = await select<AnnouncementRow>('announcements', `id=eq.${encodeURIComponent(id)}&select=cover_path`);
    await remove('announcements', id);
    await deleteFile(old[0]?.cover_path);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, 'announcements DELETE');
  }
}
