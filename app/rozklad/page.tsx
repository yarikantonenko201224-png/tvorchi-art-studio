import Link from 'next/link';
import {
  LESSONS, MOLODIZHNY, DAY_SHORT, DAY_FULL, PRICES, ALL_INCLUSIVE,
  type DayId,
} from '@/lib/data';

export const metadata = {
  title: 'Розклад занять — TVORCHI ART STUDIO',
  description: 'Розклад занять у Раківці та на Молодіжному: малювання, ліплення, робототехніка, англійська, підготовка до школи.',
};

const DAYS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function SchedulePage() {
  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Розклад занять</h1>
        <p className="t-lead">Раківка та Молодіжний. Усі матеріали входять у вартість.</p>

        <h2 className="t-h3" style={{ marginTop: 28 }}>Раківка</h2>
        {DAYS.map((day) => {
          const items = LESSONS.filter((l) => l.day === day);
          if (!items.length) return null;
          return (
            <div className="card" key={day}>
              <div className="t-label">{DAY_FULL[day]}</div>
              <div style={{ marginTop: 10 }}>
                {items.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '11px 0', borderBottom: '1px dashed var(--border-subtle)',
                    }}
                  >
                    <span className="t-price" style={{ minWidth: 52, fontSize: 15 }}>{l.time}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700 }}>{l.dir}</span>
                      <span className="t-small" style={{ display: 'block' }}>
                        {l.age} років · {l.dur} хв
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <h2 className="t-h3" style={{ marginTop: 32 }}>Молодіжний</h2>
        <p className="t-small" style={{ marginTop: 6 }}>вул. Лесі Українки, 37А</p>
        {(['mon', 'wed', 'fri'] as DayId[]).map((day) => {
          const items = MOLODIZHNY.filter((l) => l.day === day);
          if (!items.length) return null;
          return (
            <div className="card" key={day}>
              <div className="t-label">{DAY_FULL[day]}</div>
              <div style={{ marginTop: 10 }}>
                {items.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '11px 0', borderBottom: '1px dashed var(--border-subtle)',
                    }}
                  >
                    <span className="t-price" style={{ minWidth: 52, fontSize: 15 }}>{l.time}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700 }}>{l.dir}</span>
                      {l.group && (
                        <span className="t-small" style={{ display: 'block' }}>{l.group} група</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <h2 className="t-h3" style={{ marginTop: 32 }}>Ціни</h2>
        <div className="card">
          <div className="t-label">Малювання, ліплення, ранній розвиток, сенсорика, підготовка до школи, англійська</div>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            <PriceRow label="Разове заняття" value={PRICES.std.single} />
            <PriceRow label="Абонемент на 4" value={PRICES.std.pack4} />
            <PriceRow label="Абонемент на 8" value={PRICES.std.pack8} />
            <PriceRow label="Абонемент на 12" value={PRICES.std.pack12} />
          </div>
        </div>

        <div className="card">
          <div className="t-label">Робототехніка</div>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            <PriceRow label="Разове заняття" value={PRICES.rob.single} />
            <PriceRow label="Абонемент на 4" value={PRICES.rob.pack4} />
            <PriceRow label="Абонемент на 8" value={PRICES.rob.pack8} />
            <PriceRow label="Абонемент на 12" value={PRICES.rob.pack12} />
          </div>
        </div>

        <div
          className="card"
          style={{ background: 'var(--brand-orange)', border: 0, color: '#fff' }}
        >
          <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.3px' }}>
            {ALL_INCLUSIVE.title} — {ALL_INCLUSIVE.price} ₴/міс
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.45, color: 'rgba(255,255,255,.92)' }}>
            {ALL_INCLUSIVE.description}. Новим клієнтам зараз −50% — {ALL_INCLUSIVE.promoPrice} ₴.
          </p>
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

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 15 }}>
      <span style={{ color: 'var(--ink-500)' }}>{label}</span>
      <span className="t-price">{value} ₴</span>
    </div>
  );
}
