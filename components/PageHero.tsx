import Link from 'next/link';

/* Шапка внутренней страницы: пастельная волна с крупным заголовком,
   рукописной подписью и «наклейками» справа. Один компонент на все разделы,
   чтобы сайт ощущался цельным. Тон задаёт цвет фона и акцента. */

export type HeroTone = 'peach' | 'lilac' | 'mint' | 'butter' | 'pink' | 'sky';

export interface Sticker {
  big: string;
  small: string;
  color?: string;
}

export default function PageHero({
  tone = 'peach', crumb, kicker, title, lead, stickers, art, children,
}: {
  tone?: HeroTone;
  crumb: string;
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  stickers?: Sticker[];
  art?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className={`ph2 ph2--${tone}`}>
      <svg className="ph2-waves" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90 C 200 30, 380 150, 560 90 S 920 30, 1100 90 S 1360 150, 1440 80" />
        <path d="M0 170 C 220 110, 400 230, 600 170 S 940 110, 1120 170 S 1380 230, 1440 160" />
        <path d="M0 250 C 240 200, 420 300, 620 250 S 960 200, 1140 250 S 1380 300, 1440 240" />
      </svg>
      <span className="ph2-blob" aria-hidden="true" />
      <div className="wrap ph2-grid">
        <div className="ph2-text">
          <nav className="ph2-crumb" aria-label="Навігація">
            <Link href="/">Головна</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{crumb}</span>
          </nav>
          {kicker && <span className="ph2-kicker">{kicker}</span>}
          <h1 className="ph2-title">{title}</h1>
          {lead && <p className="ph2-lead">{lead}</p>}
          {children && <div className="ph2-actions">{children}</div>}
        </div>
        {(stickers?.length || art) && (
          <div className="ph2-art" aria-hidden="true">
            {art}
            {stickers?.map((s, i) => (
              <span key={s.small} className={`ph2-sticker ph2-sticker--${i}`} style={s.color ? { background: s.color } : undefined}>
                <b>{s.big}</b>
                <small>{s.small}</small>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Индикатор шагов для пошаговых форм. */
export function Steps({ items, current }: { items: string[]; current: number }) {
  return (
    <ol className="steps2" aria-label={`Крок ${current + 1} з ${items.length}`}>
      {items.map((t, i) => (
        <li key={t} className={i < current ? 'is-done' : i === current ? 'is-on' : ''}>
          <span>{i < current ? '✓' : i + 1}</span>
          <b>{t}</b>
        </li>
      ))}
    </ol>
  );
}
