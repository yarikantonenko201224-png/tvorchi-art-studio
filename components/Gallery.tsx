import Image from 'next/image';
import { getGallery } from '@/lib/content';

/* Галерея работ. Если фото ещё не загружены — блок не рендерится вовсе:
   лучше без секции, чем с пустыми рамками. */
export default async function Gallery({ limit = 6 }: { limit?: number }) {
  /* Источник — админка (Supabase). Пока там пусто — временные фото из lib/photos.ts. */
  const items = await getGallery({ limit });
  if (!items.length) return null;

  return (
    <section style={{ marginTop: 36 }}>
      <h2 className="t-h2">Роботи наших дітей</h2>
      <p className="t-lead">Кожна робота йде додому того ж дня.</p>

      <div className="gallery">
        {items.map((p) => (
          <figure key={p.src} className="gallery-item" title={p.caption}>
            <Image
              src={p.src}
              alt={p.alt}
              fill
              /* Первая работа занимает две колонки, поэтому фиксированная
                 ширина здесь врала бы: Next отдал бы узкую картинку на
                 широкое место и она размылась. Проценты ширины экрана
                 безопаснее — чуть больше трафика, зато всегда резко. */
              sizes="(max-width: 900px) 60vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
