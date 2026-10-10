import { adminGate, AdminNav } from '@/components/admin/AdminGate';
import { select, publicUrl } from '@/lib/supabase';
import { MASTER_CLASSES } from '@/lib/data';
import { MASTERCLASS_PHOTOS } from '@/lib/photos';
import type { MasterclassPhotoRow } from '@/lib/content';
import MkPhotosManager from './MkPhotosManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Фото майстер-класів — адмінка TVORCHI', robots: { index: false, follow: false } };

export default async function AdminMkPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const gate = await adminGate((await searchParams).error);
  if (gate) return gate;

  const rows = await select<MasterclassPhotoRow>('masterclass_photos', 'select=slug,image_path');
  const uploaded = new Map(rows.map((r) => [r.slug, publicUrl(r.image_path)]));

  const items = MASTER_CLASSES.map((m) => ({
    slug: m.slug,
    title: m.title,
    uploaded: uploaded.get(m.slug) ?? null,
    fallback: MASTERCLASS_PHOTOS[m.slug] ?? null,
  })).sort((a, b) => Number(Boolean(a.uploaded || a.fallback)) - Number(Boolean(b.uploaded || b.fallback)));

  const missing = items.filter((i) => !i.uploaded && !i.fallback).length;

  return (
    <div className="page admin" style={{ paddingTop: 20 }}>
      <AdminNav active="mk" />
      <h1 className="t-h1">Фото майстер-класів</h1>
      <p className="t-small" style={{ marginTop: 6, maxWidth: 620 }}>
        Одне фото на майстер-клас — воно стоїть на картці на сайті.
        {missing > 0 ? ` Без фото зараз: ${missing}.` : ' У всіх майстер-класів є фото.'}{' '}
        Позначка «тимчасове» — це згенерована картинка з коду, її варто замінити справжнім фото.
      </p>
      <MkPhotosManager initial={items} />
    </div>
  );
}
