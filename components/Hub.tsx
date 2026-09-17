import Link from 'next/link';
import Logo from './Logo';
import { STUDIO, TRIAL_PRICE } from '@/lib/data';
import { getAnnouncements, upcoming, formatDate } from '@/lib/announcements';

/* Точка входа по ссылке из Instagram bio.
   Задача экрана: за 3 секунды объяснить, куда человек попал,
   и дать 4 крупных действия. Никаких длинных текстов о студии. */
export default async function Hub() {
  const announcements = upcoming(await getAnnouncements()).slice(0, 1);

  return (
    <>
      <div className="page">
        <div className="topbar">
          <Logo href="/" height={46} />
          <a className="icon-btn" href={STUDIO.phoneHref} aria-label="Подзвонити">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <p className="t-small" style={{ marginTop: 12 }}>
          Арт-студія, майстер-класи та школа розвитку · {STUDIO.city} · від 3 років
        </p>

        {announcements.map((a) => (
          <Link key={a.id} className="announce" href="/anonsy">
            <span className="dot" aria-hidden="true" />
            <span>
              <b>{a.title}</b> · {formatDate(a.startsAt)}
              {a.place ? ` · ${a.place.split(',')[0]}` : ''}
            </span>
          </Link>
        ))}

        <div className="grid-2">
          <Link className="tile tile--primary" href="/zapys">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="28" y="6" width="8" height="26" rx="4" fill="#fff" />
              <rect x="24" y="30" width="16" height="9" rx="2" fill="#FBD668" />
              <path d="M24 39h16l-3 13-5 8-5-8z" fill="#fff" />
            </svg>
            <span className="t">
              Записатися
              <br />
              на заняття
            </span>
            <span className="d">Пробне · {TRIAL_PRICE} ₴</span>
          </Link>

          <Link className="tile" href="/den-narodzhennya">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="12" y="30" width="40" height="24" rx="6" fill="#F73FA6" />
              <rect x="12" y="30" width="40" height="8" fill="#4FD1D9" />
              <rect x="30" y="12" width="4" height="16" rx="2" fill="#8A8078" />
              <circle cx="32" cy="9" r="5" fill="#FBD668" />
            </svg>
            <span className="t">
              День
              <br />
              народження
            </span>
            <span className="d">від 2000 ₴</span>
          </Link>

          <Link className="tile" href="/rozklad">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect x="9" y="12" width="46" height="42" rx="7" fill="#45C8C8" />
              <rect x="9" y="12" width="46" height="11" fill="#12706F" />
              <rect x="17" y="30" width="12" height="5" rx="2.5" fill="#fff" />
              <rect x="35" y="30" width="12" height="5" rx="2.5" fill="#fff" />
              <rect x="17" y="41" width="12" height="5" rx="2.5" fill="#fff" />
            </svg>
            <span className="t">
              Розклад
              <br />і ціни
            </span>
            <span className="d">2 локації</span>
          </Link>

          <Link className="tile" href="/maister-klasy">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M20 8h24l-4 26a8 8 0 0 1-16 0z" fill="#FBD668" />
              <rect x="28" y="34" width="8" height="14" fill="#8A8078" />
              <rect x="18" y="48" width="28" height="8" rx="4" fill="#F26F21" />
            </svg>
            <span className="t">
              Майстер-
              <br />
              класи
            </span>
            <span className="d">від 150 ₴</span>
          </Link>
        </div>

        <Link
          href="/pidbir"
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--surface-soft)',
            border: 0,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 14.5, lineHeight: 1.3, color: 'var(--ink-700)' }}>
            <b style={{ color: 'var(--ink-900)', fontWeight: 800 }}>
              Не знаєте, що підійде дитині?
            </b>
            <br />
            Підберемо за 3 питання
          </span>
          <span style={{ color: 'var(--brand-orange)', fontWeight: 800, fontSize: 18 }}>→</span>
        </Link>

        <Link
          href="/faq"
          className="card"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, textDecoration: 'none', background: 'var(--surface-soft)', border: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15 }}>Питання та відповіді</span>
          <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>→</span>
        </Link>

        <Link
          href="/sertyfikaty"
          className="card"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, textDecoration: 'none', background: 'var(--surface-soft)', border: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15 }}>Подарунковий сертифікат</span>
          <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>→</span>
        </Link>

        <p
          style={{
            margin: '22px 0 0',
            fontSize: 12.5,
            lineHeight: 1.45,
            color: 'var(--ink-400)',
            textAlign: 'center',
          }}
        >
          Раківка та Молодіжний · {STUDIO.phone}
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
