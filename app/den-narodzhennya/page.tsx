'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BIRTHDAY_AGES, BIRTHDAY_THEMES, BIRTHDAY_CAPACITY, STUDIO,
  packagesByAge, packageDiff,
  type BirthdayAgeId, type BirthdayPackage,
} from '@/lib/data';
import { childrenWord } from '@/lib/format';

type Step = 'age' | 'package' | 'theme' | 'kids' | 'summary';

const STEPS: Step[] = ['age', 'package', 'theme', 'kids', 'summary'];

export default function BirthdayPage() {
  const [step, setStep] = useState<Step>('age');
  const [age, setAge] = useState<BirthdayAgeId | null>(null);
  const [pkg, setPkg] = useState<BirthdayPackage | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [ownTheme, setOwnTheme] = useState('');
  const [kids, setKids] = useState(10);

  const stepIndex = STEPS.indexOf(step);

  function back() {
    if (stepIndex === 0) return;
    setStep(STEPS[stepIndex - 1]);
  }

  const themeLabel = theme === '__own' ? ownTheme.trim() || 'Своя тематика' : theme;

  return (
    <>
      <div className="page">
        <div className="topbar">
          {stepIndex === 0 ? (
            <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
          ) : (
            <button className="icon-btn" onClick={back} aria-label="Назад">←</button>
          )}
          <span className="t-small">{stepIndex + 1} / {STEPS.length}</span>
        </div>

        {/* прогресс */}
        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {STEPS.map((s, i) => (
            <span
              key={s}
              style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= stepIndex ? 'var(--brand-orange)' : 'var(--border-subtle)',
              }}
            />
          ))}
        </div>

        {step === 'age' && (
          <>
            <h1 className="t-h1" style={{ marginTop: 20 }}>Скільки років імениннику?</h1>
            <p className="t-lead">Програма і тематики відрізняються за віком.</p>
            <div className="grid-2">
              {BIRTHDAY_AGES.map((a) => (
                <button
                  key={a.id}
                  className="tile"
                  style={{ minHeight: 96, justifyContent: 'center' }}
                  onClick={() => { setAge(a.id); setPkg(null); setTheme(null); setStep('package'); }}
                >
                  <span style={{ fontWeight: 900, fontSize: 25, letterSpacing: '-.8px' }}>{a.title}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'package' && age && (
          <>
            <h1 className="t-h1" style={{ marginTop: 20 }}>Оберіть пакет</h1>
            <p className="t-lead">До {BIRTHDAY_CAPACITY} дітей розміщуємо комфортно у студії.</p>

            {packagesByAge(age).map((p) => {
              const diff = packageDiff(age, p.tier);
              const selected = pkg?.tier === p.tier;
              return (
                <button
                  key={p.tier}
                  onClick={() => { setPkg(p); setStep('theme'); }}
                  className="card"
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    borderColor: selected ? 'var(--brand-orange)' : undefined,
                    borderWidth: 1.5, font: 'inherit',
                  }}
                >
                  <div className="card-head">
                    <div>
                      <div className="t-h3">{p.title}</div>
                      <div className="t-small" style={{ marginTop: 5 }}>{p.durationLabel}</div>
                    </div>
                    <span className="t-price" style={{ fontSize: 19 }}>{p.price} ₴</span>
                  </div>

                  {p.tier === 'mini' ? (
                    <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                      {p.includes.map((i) => (
                        <li key={i} className="t-small" style={{ padding: '3px 0' }}>· {i}</li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <div className="t-small" style={{ color: 'var(--ink-400)' }}>
                        Усе з попереднього пакета, плюс:
                      </div>
                      <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>
                        {diff.map((i) => (
                          <li key={i} style={{ padding: '3px 0', fontSize: 14, fontWeight: 600 }}>
                            <span style={{ color: 'var(--brand-orange)' }}>+</span> {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </>
        )}

        {step === 'theme' && age && (
          <>
            <h1 className="t-h1" style={{ marginTop: 20 }}>Тематика свята</h1>
            <p className="t-lead">Можемо зробити будь-яку — навіть якщо її немає в списку.</p>

            <div className="chips" style={{ marginTop: 18 }}>
              {BIRTHDAY_THEMES[age].map((t) => (
                <button
                  key={t}
                  className="chip chip--text"
                  aria-pressed={theme === t}
                  onClick={() => { setTheme(t); setStep('kids'); }}
                  style={{ minHeight: 48 }}
                >
                  {t}
                </button>
              ))}
              <button
                className="chip chip--text"
                aria-pressed={theme === '__own'}
                onClick={() => setTheme('__own')}
                style={{ minHeight: 48 }}
              >
                Своя тематика
              </button>
            </div>

            {theme === '__own' && (
              <div className="field">
                <label className="t-label" htmlFor="ownTheme">Яка саме?</label>
                <input
                  id="ownTheme"
                  className="input"
                  value={ownTheme}
                  placeholder="Напишіть ідею"
                  onChange={(e) => setOwnTheme(e.target.value)}
                />
                <button className="btn btn--wide" style={{ marginTop: 14 }} onClick={() => setStep('kids')}>
                  Далі
                </button>
              </div>
            )}
          </>
        )}

        {step === 'kids' && (
          <>
            <h1 className="t-h1" style={{ marginTop: 20 }}>Скільки буде дітей?</h1>
            <p className="t-lead">Разом з іменинником.</p>

            <div className="card" style={{ marginTop: 20, textAlign: 'center' }}>
              <div className="t-price" style={{ fontSize: 44, lineHeight: 1 }}>{kids}</div>
              <input
                type="range"
                min={4}
                max={20}
                value={kids}
                onChange={(e) => setKids(Number(e.target.value))}
                style={{ width: '100%', marginTop: 16, accentColor: 'var(--brand-orange)' }}
                aria-label="Кількість дітей"
              />
              <div className="t-small" style={{ marginTop: 8 }}>
                {kids > BIRTHDAY_CAPACITY
                  ? 'Більше 15 — напишіть нам, підберемо формат.'
                  : `До ${BIRTHDAY_CAPACITY} дітей розміщуємо комфортно`}
              </div>
            </div>

            <button className="btn btn--wide" style={{ marginTop: 20 }} onClick={() => setStep('summary')}>
              Далі
            </button>
          </>
        )}

        {step === 'summary' && pkg && age && (
          <>
            <h1 className="t-h1" style={{ marginTop: 20 }}>Ваше свято</h1>
            <p className="t-lead">Перевірте і залишайте заявку — підтвердимо дату.</p>

            <div className="card" style={{ marginTop: 20 }}>
              {[
                ['Вік', BIRTHDAY_AGES.find((a) => a.id === age)?.title ?? ''],
                ['Пакет', pkg.title],
                ['Тривалість', pkg.durationLabel],
                ['Тематика', themeLabel ?? '—'],
                ['Дітей', `${kids} ${childrenWord(kids)}`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex', justifyContent: 'space-between', gap: 14,
                    padding: '10px 0', borderBottom: '1px dashed var(--border-subtle)',
                    fontSize: 14.5, color: 'var(--ink-500)',
                  }}
                >
                  <span>{k}</span>
                  <b style={{ color: 'var(--ink-900)', fontWeight: 700, textAlign: 'right' }}>{v}</b>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                <span className="t-h3">Разом</span>
                <span className="t-price" style={{ fontSize: 30 }}>{pkg.price} ₴</span>
              </div>
            </div>

            <div className="note">
              Що входить: {pkg.includes.join(', ')}.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.viber}
                 style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                Viber
              </a>
              <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.phoneHref}
                 style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                Подзвонити
              </a>
            </div>
          </>
        )}
      </div>

      {(step === 'summary' || pkg) && (
        <div className="bar">
          <div className="bar-info">
            <div className="k">{pkg ? pkg.title : 'Пакет не обрано'}</div>
            <div className="v">{pkg ? `${pkg.price} ₴` : '—'}</div>
          </div>
          <button
            className="btn"
            onClick={() => (step === 'summary' ? undefined : setStep('summary'))}
            disabled={!pkg}
          >
            {step === 'summary' ? 'Забронювати дату' : 'До підсумку'}
          </button>
        </div>
      )}
    </>
  );
}
