import { adminGate, AdminNav } from '@/components/admin/AdminGate';
import { select, publicUrl } from '@/lib/supabase';
import { GALLERY_ORDER, type GalleryRow } from '@/lib/content';
import GalleryManager from './GalleryManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Галерея — адмінка TVORCHI', robots: { index: false, follow: false } };

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const gate = await adminGate((await searchParams).error);
  if (gate) return gate;

  const rows = await select<GalleryRow>('gallery_items', GALLERY_ORDER);
  const items = rows.map((r) => ({ ...r, url: publicUrl(r.image_path) }));

  return (
    <div className="page admin" style={{ paddingTop: 20 }}>
      <AdminNav active="gallery" />
      <h1 className="t-h1">Галерея робіт</h1>
      <p className="t-small" style={{ marginTop: 6, maxWidth: 620 }}>
        Фото з’являються на сайті одразу після завантаження. На гірлянді головної — перші 5
        з позначкою «На головній». Підпис необов’язковий: ім’я та вік дитини — лише зі згоди батьків.
      </p>
      <GalleryManager initial={items} />
    </div>
  );
}
