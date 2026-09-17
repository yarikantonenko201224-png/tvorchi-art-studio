import { STUDIO } from '@/lib/data';
import { formatDate, type Announcement } from '@/lib/announcements';

/* Карточка события. Полное описание раскрывается на месте —
   отдельная страница под каждое событие пока избыточна: их единицы,
   а лишний переход удлиняет путь до записи. */
export default function AnnounceCard({ item }: { item: Announcement }) {
  const soldOut = item.seats === 0;

  return (
    <article className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {item.cover && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={item.cover} alt="" className="announce-cover" />
      )}

      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="badge badge--warn">{formatDate(item.startsAt)}</span>
          {soldOut ? (
            <span className="badge" style={{ background: '#FBEAE9', color: '#8E1F19' }}>
              місць немає
            </span>
          ) : (
            typeof item.seats === 'number' && (
              <span className="badge">{item.seats} вільних місць</span>
            )
          )}
          {item.age && <span className="t-small">{item.age}</span>}
        </div>

        <h3 className="t-h3" style={{ marginTop: 12 }}>{item.title}</h3>
        <p className="t-small" style={{ marginTop: 8, color: 'var(--ink-700)', fontSize: 15 }}>
          {item.short}
        </p>

        {item.place && (
          <p className="t-small" style={{ marginTop: 10 }}>📍 {item.place}</p>
        )}
        {item.price && (
          <p className="t-small" style={{ marginTop: 4 }}>{item.price}</p>
        )}

        {item.full && (
          <details className="faq" style={{ borderBottom: 0, marginTop: 6 }}>
            <summary style={{ fontSize: 14.5, paddingBottom: 10 }}>
              <span>Детальніше</span>
              <span className="faq-sign" aria-hidden="true" />
            </summary>
            <p style={{ paddingRight: 0 }}>{item.full}</p>
          </details>
        )}

        {!soldOut && (
          <a
            className="btn btn--small btn--wide"
            href={item.link || STUDIO.viber}
            style={{ display: 'grid', placeItems: 'center', marginTop: 14, textDecoration: 'none' }}
          >
            Зареєструватися
          </a>
        )}
      </div>
    </article>
  );
}
