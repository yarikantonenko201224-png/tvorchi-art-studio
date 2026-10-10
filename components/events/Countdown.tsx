'use client';

import { useEffect, useState } from 'react';

/* Обратный отсчёт до события. До гидрации показываем пустые ячейки,
   чтобы серверное и клиентское время не спорили. */
export default function Countdown({ to, doneText }: { to: string; doneText: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [to]);

  if (left === 0) return <p className="ev-cd-done">{doneText}</p>;
  const s = left === null ? null : Math.floor(left / 1000);
  const parts = [
    { v: s === null ? '··' : Math.floor(s / 86400), l: 'днів' },
    { v: s === null ? '··' : Math.floor((s % 86400) / 3600), l: 'годин' },
    { v: s === null ? '··' : Math.floor((s % 3600) / 60), l: 'хвилин' },
    { v: s === null ? '··' : s % 60, l: 'секунд' },
  ];
  return (
    <div className="ev-cd" role="timer" aria-label="До виїзду">
      {parts.map((p) => (
        <span key={p.l}><b>{typeof p.v === 'number' ? String(p.v).padStart(2, '0') : p.v}</b><small>{p.l}</small></span>
      ))}
    </div>
  );
}
