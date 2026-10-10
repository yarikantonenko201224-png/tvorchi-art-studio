import { adminGate, AdminNav } from '@/components/admin/AdminGate';
import { select, publicUrl } from '@/lib/supabase';
import { isoToKyivLocal, nowKyivLocal, type AnnouncementRow } from '@/lib/content';
import AnnouncementsManager, { type EditableAnnouncement } from './AnnouncementsManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Анонси — адмінка TVORCHI', robots: { index: false, follow: false } };

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const gate = await adminGate((await searchParams).error);
  if (gate) return gate;

  const rows = await select<AnnouncementRow>('announcements', 'order=starts_at.desc&limit=200');
  const now = nowKyivLocal();

  const items: EditableAnnouncement[] = rows.map((r) => {
    const starts = isoToKyivLocal(r.starts_at) ?? '';
    const ends = isoToKyivLocal(r.ends_at) ?? '';
    const endKey = ends || `${starts.slice(0, 10)} 23:59`;
    return {
      id: r.id,
      title: r.title,
      starts_at: starts.replace(' ', 'T'),
      ends_at: ends.replace(' ', 'T'),
      place: r.place ?? '',
      age: r.age ?? '',
      short: r.short ?? '',
      full_text: r.full_text ?? '',
      price: r.price ?? '',
      seats: r.seats === null ? '' : String(r.seats),
      link: r.link ?? '',
      active: r.active,
      cover_path: r.cover_path ?? '',
      cover_url: r.cover_path ? publicUrl(r.cover_path) : '',
      past: endKey < now,
    };
  });

  return (
    <div className="page admin" style={{ paddingTop: 20 }}>
      <AdminNav active="events" />
      <h1 className="t-h1">Анонси подій</h1>
      <p className="t-small" style={{ marginTop: 6, maxWidth: 620 }}>
        Події показуються на сторінці «Анонси», найближчі — на головній. Коли подія минає,
        вона сама зникає з сайту, тут лишається в архіві. Час — київський.
      </p>
      <AnnouncementsManager initial={items} />
    </div>
  );
}
