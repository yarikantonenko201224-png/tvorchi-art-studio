/* ============================================================
   Контент, который студия ведёт сама через админку:
   галерея работ, фото мастер-классов, анонсы.

   Правило для всех трёх: если база не подключена или в ней пусто,
   сайт показывает то, что лежит в коде (lib/photos.ts, демо-анонсы).
   Сбой базы никогда не роняет страницу.
   ============================================================ */

import { GALLERY, MASTERCLASS_PHOTOS, type Photo } from './photos';
import { isSupabaseReady, selectCached, publicUrl } from './supabase';

/* ---------------- Галерея ---------------- */

export interface GalleryRow {
  id: string;
  created_at: string;
  image_path: string;
  caption: string | null;
  sort: number;
  on_home: boolean;
  active: boolean;
}

export const GALLERY_ORDER = 'order=sort.asc,created_at.desc';

/** Работы для сайта. onlyHome — только отмеченные «показувати на головній». */
export async function getGallery(opts: { onlyHome?: boolean; limit?: number } = {}): Promise<Photo[]> {
  if (isSupabaseReady()) {
    try {
      const filter = `active=eq.true${opts.onlyHome ? '&on_home=eq.true' : ''}`;
      const rows = await selectCached<GalleryRow>(
        'gallery_items',
        `${filter}&${GALLERY_ORDER}${opts.limit ? `&limit=${opts.limit}` : ''}`,
      );
      if (rows.length) {
        return rows.map((r) => ({
          src: publicUrl(r.image_path),
          alt: r.caption ? `Робота: ${r.caption}` : 'Робота учня студії TVORCHI',
          caption: r.caption ?? undefined,
        }));
      }
    } catch (error) {
      console.error('[content] gallery', error);
    }
  }
  return opts.limit ? GALLERY.slice(0, opts.limit) : GALLERY;
}

/* ---------------- Фото мастер-классов ---------------- */

export interface MasterclassPhotoRow {
  slug: string;
  image_path: string;
  updated_at: string;
}

/** slug → ссылка на фото. Загруженное в админке перекрывает фото из кода. */
export async function getMasterclassPhotos(): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...MASTERCLASS_PHOTOS };
  if (!isSupabaseReady()) return result;

  try {
    const rows = await selectCached<MasterclassPhotoRow>('masterclass_photos', 'select=slug,image_path');
    for (const r of rows) result[r.slug] = publicUrl(r.image_path);
  } catch (error) {
    console.error('[content] masterclass photos', error);
  }
  return result;
}

/* ---------------- Время по Киеву ----------------
   Администратор вводит «20 вересня, 13:00» — это киевское время.
   В базе хранится момент времени (timestamptz), поэтому при записи
   добавляем правильный сдвиг (+02 зимой, +03 летом), а при чтении
   переводим обратно в киевское. Сервер Vercel живёт в UTC — без этого
   все события съехали бы на 2–3 часа. */

const TZ = 'Europe/Kyiv';

function kyivParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour'), min: get('minute'), s: get('second') };
}

/** «2026-09-20T13:00» (киевское) → ISO-момент для базы. */
export function kyivLocalToISO(local: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(local.trim());
  if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // смещение Киева в этот момент: насколько киевские часы «впереди» UTC
  const p = kyivParts(new Date(asUtc));
  const shown = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
  const offset = shown - asUtc;
  return new Date(asUtc - offset).toISOString();
}

/** ISO-момент из базы → «2026-09-20 13:00» по Киеву (формат, который понимает весь сайт). */
export function isoToKyivLocal(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const p = kyivParts(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${p.y}-${pad(p.m)}-${pad(p.d)} ${pad(p.h)}:${pad(p.min)}`;
}

/** Текущий момент по Киеву в том же формате — чтобы сравнивать с датами событий. */
export function nowKyivLocal(): string {
  return isoToKyivLocal(new Date().toISOString())!;
}

/* ---------------- Анонсы ---------------- */

export interface AnnouncementRow {
  id: string;
  created_at: string;
  title: string;
  cover_path: string | null;
  starts_at: string;
  ends_at: string | null;
  place: string | null;
  age: string | null;
  short: string | null;
  full_text: string | null;
  price: string | null;
  seats: number | null;
  link: string | null;
  active: boolean;
}
