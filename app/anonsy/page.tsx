import Link from 'next/link';
import AnnounceCard from '@/components/AnnounceCard';
import { getAnnouncements, upcoming } from '@/lib/announcements';
import { STUDIO } from '@/lib/data';

export const metadata = {
  title: 'Анонси та події — TVORCHI ART STUDIO',
  description:
    'Найближчі події студії TVORCHI у Кременчуці: дні відкритих дверей, тематичні вечірки, майстер-класи та акції.',
};

export default async function AnnouncementsPage() {
  const all = await getAnnouncements();
  const events = upcoming(all);

  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Анонси та події</h1>
        <p className="t-lead">
          Дні відкритих дверей, тематичні вечірки, майстер-класи та акції.
          Події, що минули, зникають зі списку автоматично.
        </p>

        {events.length ? (
          <div className="cards-grid" style={{ marginTop: 16 }}>
            {events.map((item) => (
              <AnnounceCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="note" style={{ marginTop: 24 }}>
            Найближчим часом запланованих подій немає. Слідкуйте за оновленнями
            в Instagram — там ми анонсуємо все першими.
          </div>
        )}

        <div className="note" style={{ marginTop: 20 }}>
          Хочете дізнаватися про події першими? Підпишіться на{' '}
          <a href={STUDIO.instagram} target="_blank" rel="noopener"
             style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            Instagram студії
          </a>.
        </div>
      </div>

      <div className="bar">
        <Link className="btn btn--wide" href="/zapys" style={{ display: 'grid', placeItems: 'center' }}>
          Записатися на заняття
        </Link>
      </div>
    </>
  );
}
