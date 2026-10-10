'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { activePromos } from '@/lib/events';

/* Лента над шапкой на всех страницах в сезон: по очереди показывает
   ближайшие спецпроєкти (поездка, табір, вечірки). Прошедшие отсеиваются
   по времени в браузере, чтобы закешированная страница не звала на то,
   что уже было. */

function kyivNow(): string {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? '00';
  return `${g('year')}-${g('month')}-${g('day')} ${g('hour')}:${g('minute')}`;
}

const ICONS = ['🍂', '🎃', '🦇'];

export default function SeasonBanner() {
  const path = usePathname();
  const [items, setItems] = useState(() => activePromos('0000'));
  const [i, setI] = useState(0);

  useEffect(() => {
    setItems(activePromos(kyivNow()));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % items.length), 4800);
    return () => window.clearInterval(t);
  }, [items.length]);

  const list = items.filter((p) => p.href !== path);
  if (!list.length || path?.startsWith('/admin')) return null;
  const cur = list[i % list.length];
  const icon = ICONS[Math.max(0, activePromos('0000').findIndex((p) => p.href === cur.href))];

  return (
    <Link href={cur.href} className="hw-banner" aria-live="polite">
      <span key={cur.href} className="hw-banner-in">
        <span className="hw-banner-pump" aria-hidden="true">{icon}</span>
        <span className="hw-banner-text">
          <b>{cur.title}</b>
          <span className="hw-banner-dates"> · {cur.when}</span>
        </span>
      </span>
      <span className="hw-banner-cta">Детальніше <i aria-hidden="true">→</i></span>
      {list.length > 1 && (
        <span className="hw-banner-dots" aria-hidden="true">
          {list.map((p, k) => <i key={p.href} className={k === i % list.length ? 'is-on' : ''} />)}
        </span>
      )}
    </Link>
  );
}
