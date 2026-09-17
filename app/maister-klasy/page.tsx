'use client';

import { useState } from 'react';
import Link from 'next/link';
import { masterClassesFor, STUDIO } from '@/lib/data';
import { masterClassesWord } from '@/lib/format';

type Audience = 'kids' | 'adults';

export default function MasterClassesPage() {
  const [audience, setAudience] = useState<Audience>('kids');
  const list = masterClassesFor(audience);

  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Майстер-класи</h1>
        <p className="t-lead">
          Разові заняття без абонемента. Усі матеріали входять у вартість,
          робота йде додому того ж дня.
        </p>

        {/* Переключатель аудитории: один каталог, а не два раздела —
            16 позиций из 23 общие для детей и взрослых */}
        <div
          role="group"
          aria-label="Для кого"
          style={{
            display: 'flex', gap: 4, marginTop: 20, padding: 4,
            background: 'var(--surface-soft)', borderRadius: 'var(--radius-control)',
          }}
        >
          {([['kids', 'Дітям'], ['adults', 'Дорослим']] as [Audience, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setAudience(id)}
              aria-pressed={audience === id}
              style={{
                flex: 1, minHeight: 44, border: 0, cursor: 'pointer',
                borderRadius: 14, font: 'inherit', fontWeight: 700, fontSize: 15,
                background: audience === id ? '#fff' : 'transparent',
                color: audience === id ? 'var(--ink-900)' : 'var(--ink-500)',
                boxShadow: audience === id ? 'var(--shadow-soft)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {audience === 'adults' && (
          <div className="note" style={{ marginTop: 16 }}>
            Дорослі майстер-класи часто беруть компанією: дівич-вечір, зустріч подруг,
            корпоратив. Напишіть, скільки вас — підберемо формат і час.
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          {list.map((m) => {
            const p = m[audience]!;
            return (
              <div
                key={m.slug}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 14, padding: '15px 0', borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.3 }}>{m.title}</span>
                <span className="t-price" style={{ fontSize: 16, whiteSpace: 'nowrap' }}>
                  {p.from && <span style={{ fontWeight: 400, color: 'var(--ink-500)', fontSize: 13 }}>від </span>}
                  {p.price} ₴
                </span>
              </div>
            );
          })}
        </div>

        <div className="note">
          Майстер-клас можна подарувати — оформимо сертифікат на конкретне заняття
          або на суму.
        </div>
      </div>

      <div className="bar">
        <div className="bar-info">
          <div className="k">{audience === 'kids' ? 'Дітям' : 'Дорослим'}</div>
          <div className="v">{list.length} {masterClassesWord(list.length)}</div>
        </div>
        <a className="btn" href={STUDIO.viber} style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Записатися
        </a>
      </div>
    </>
  );
}
