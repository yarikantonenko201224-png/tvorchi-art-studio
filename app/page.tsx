import Link from 'next/link';
import Hero from '@/components/Hero';
import AnnounceCard from '@/components/AnnounceCard';
import { CakeIcon, PaletteIcon } from '@/components/Icons';
import Gallery from '@/components/Gallery';
import {
  AGE_GROUPS, ALL_INCLUSIVE, STUDIO, PRICES, TRIAL_PRICE, GROUP_SIZE_MAX,
  lessonsByAge,
} from '@/lib/data';
import { getAnnouncements, upcoming } from '@/lib/announcements';
import { lessonsWord } from '@/lib/format';

export default async function HomePage() {
  /* ТЗ: на главной показываем 1–3 ближайших события */
  const announcements = upcoming(await getAnnouncements()).slice(0, 3);

  return (
    <>
      <div className="page">
        <div className="topbar" style={{ justifyContent: 'flex-end' }}>
          <a className="icon-btn" href={STUDIO.phoneHref} aria-label="Подзвонити">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <Hero />

        {announcements.length > 0 && (
          <>
            <div
              style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                gap: 12, marginTop: 36,
              }}
            >
              <h2 className="t-h2">Найближчі події</h2>
              <Link href="/anonsy" style={{ color: 'var(--brand-orange)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                усі →
              </Link>
            </div>
            <div className="cards-grid">
              {announcements.map((a) => (
                <AnnounceCard key={a.id} item={a} />
              ))}
            </div>
          </>
        )}

        {/* Возрастные группы — ядро новой системы студии.
            Вынесены на мягкую подложку, чтобы страница не читалась
            как один сплошной столбец карточек. */}
        <section className="band">
        <h2 className="t-h2">Чотири вікові групи</h2>
        <p className="t-lead">
          У кожної — свій набір напрямів і своя тривалість заняття.
          Групи невеликі, до {GROUP_SIZE_MAX} дітей: педагог встигає до кожного.
        </p>

        <div className="cards-grid">
        {AGE_GROUPS.map((g) => {
          const count = lessonsByAge(g.id).length;
          const dur = lessonsByAge(g.id)[0]?.dur ?? 60;
          return (
            <Link key={g.id} href="/zapys" className="card" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="card-head">
                <div>
                  <div className="t-h3">{g.title} років</div>
                  <div className="t-small" style={{ marginTop: 6 }}>{g.note}</div>
                </div>
                <span className="badge">{dur} хв</span>
              </div>
              <div className="card-foot">
                <span className="t-small">
                  {count} {lessonsWord(count)} на тиждень · від{' '}
                  <span className="t-price" style={{ color: 'var(--ink-900)' }}>{PRICES.std.single} ₴</span>
                </span>
                <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>→</span>
              </div>
            </Link>
          );
        })}
        </div>
        </section>

        {/* All Inclusive */}
        <div className="card" style={{ background: 'var(--brand-orange)', border: 0, color: '#fff', marginTop: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: '-.4px' }}>
            {ALL_INCLUSIVE.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span className="t-price" style={{ fontSize: 32 }}>{ALL_INCLUSIVE.price} ₴</span>
            <span style={{ opacity: 0.85 }}>на місяць</span>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.45, color: 'rgba(255,255,255,.92)' }}>
            {ALL_INCLUSIVE.description}.
          </p>
          <Link
            href="/rozklad"
            className="btn btn--small btn--wide"
            style={{
              display: 'grid', placeItems: 'center', marginTop: 16,
              background: '#fff', color: 'var(--brand-orange)', textDecoration: 'none',
            }}
          >
            Що входить
          </Link>
        </div>

        {/* Свята и мастер-классы */}
        <div className="grid-2" style={{ marginTop: 28 }}>
          <Link className="tile" href="/den-narodzhennya">
            <CakeIcon />
            <span className="t">День народження</span>
            <span className="d">від 2000 ₴ · до 15 дітей</span>
          </Link>

          <Link className="tile" href="/maister-klasy">
            <PaletteIcon />
            <span className="t">Майстер-класи</span>
            <span className="d">дітям і дорослим</span>
          </Link>
        </div>

        <Gallery />

        {/* Локации */}
        <h2 className="t-h2" style={{ marginTop: 36 }}>Де ми</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="t-h3">Раківка</div>
            <div className="t-small" style={{ marginTop: 6 }}>
              Основна локація: всі вікові групи, репетиторство
            </div>
          </div>
          <div className="card">
            <div className="t-h3">Молодіжний</div>
            <div className="t-small" style={{ marginTop: 6 }}>
              вул. Лесі Українки, 37А · англійська, малювання, робототехніка
            </div>
          </div>
        </div>

        <div className="note" style={{ marginTop: 20 }}>
          Не знаєте, з чого почати? Пробне заняття коштує {TRIAL_PRICE} ₴ —
          подивимось, що дитині відгукнеться, і підкажемо напрямок.
        </div>

        <Link
          href="/faq"
          className="card"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, textDecoration: 'none', marginTop: 20,
          }}
        >
          <span>
            <span className="t-h3">Питання та відповіді</span>
            <span className="t-small" style={{ display: 'block', marginTop: 4 }}>
              Оплата, пропуски, сертифікати, індивідуальні заняття
            </span>
          </span>
          <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>→</span>
        </Link>

        <p style={{ margin: '24px 0 0', fontSize: 13, color: 'var(--ink-400)', textAlign: 'center' }}>
          {STUDIO.phone} · {STUDIO.city}
        </p>
      </div>

      <div className="bar">
        <div className="bar-info">
          <div className="k">Пробне заняття</div>
          <div className="v">{TRIAL_PRICE} ₴</div>
        </div>
        <Link className="btn" href="/zapys" style={{ display: 'grid', placeItems: 'center' }}>
          Записатися
        </Link>
      </div>
    </>
  );
}
