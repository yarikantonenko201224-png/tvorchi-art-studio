'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero, { Steps } from '@/components/PageHero';
import Capy from '@/components/Capy';
import {
  BIRTHDAY_AGES, BIRTHDAY_THEMES, BIRTHDAY_CAPACITY, STUDIO,
  packagesByAge, packageDiff,
  type BirthdayAgeId, type BirthdayPackage,
} from '@/lib/data';
import { childrenWord, formatPhone, isPhoneComplete } from '@/lib/format';
import { sendLead } from '@/lib/send-lead';

type Step = 'age' | 'package' | 'theme' | 'kids' | 'summary';

const STEPS: Step[] = ['age', 'package', 'theme', 'kids', 'summary'];

export default function BirthdayPage() {
  const [step, setStep] = useState<Step>('age');
  const [age, setAge] = useState<BirthdayAgeId | null>(null);
  const [pkg, setPkg] = useState<BirthdayPackage | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [ownTheme, setOwnTheme] = useState('');
  const [kids, setKids] = useState(10);

  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const nameOk = parentName.trim().length >= 2;
  const phoneOk = isPhoneComplete(phone);
  const formOk = nameOk && phoneOk;

  const stepIndex = STEPS.indexOf(step);

  function back() {
    if (stepIndex === 0) return;
    setStep(STEPS[stepIndex - 1]);
  }

  const themeLabel = theme === '__own' ? ownTheme.trim() || 'Своя тематика' : theme;
  const ageLabel = BIRTHDAY_AGES.find((a) => a.id === age)?.title ?? '';
  const today = new Date().toISOString().slice(0, 10);
  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'short' })
    : 'узгодимо';

  async function submit() {
    setTouched(true);
    if (!formOk || sending || !pkg) return;
    setSending(true);
    await sendLead({
      source: 'birthday',
      parentName: parentName.trim(),
      childName: childName.trim() || undefined,
      phone,
      direction: `День народження: ${pkg.title}`,
      people: kids,
      amount: pkg.price,
      payload: {
        age: ageLabel,
        package: pkg.title,
        duration: pkg.durationLabel,
        theme: themeLabel ?? undefined,
        kids,
        date: date || undefined,
      },
    });
    setSending(false);
    setDone(true);
    window.scrollTo(0, 0);
  }

  if (done && pkg) {
    return (
      <BdFrame idx={STEPS.length}>
        <div>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ display: 'block', margin: '20px auto 0' }} aria-hidden="true">
            <circle cx="38" cy="38" r="36" fill="#E9F7F7" />
            <path d="M23 39.5 33.5 50 54 27" fill="none" stroke="#12706F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="t-h2" style={{ textAlign: 'center', marginTop: 16 }}>Заявку на свято прийнято</h1>
          <p className="t-lead" style={{ textAlign: 'center' }}>
            Зателефонуємо, щоб підтвердити дату й обговорити деталі.
          </p>

          <div className="card" style={{ background: 'var(--surface-soft)', border: 0, marginTop: 20 }}>
            {[
              ['Пакет', pkg.title],
              ['Дітей', `${kids} ${childrenWord(kids)}`],
              ['Дата', dateLabel],
              ['Разом', `${pkg.price} ₴`],
              ['Телефон', phone],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '9px 0', fontSize: 14.5, color: 'var(--ink-500)' }}>
                <span>{k}</span>
                <b style={{ color: 'var(--ink-900)', fontWeight: 700, textAlign: 'right' }}>{v}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="bar">
          <Link className="btn btn--wide" href="/" style={{ display: 'grid', placeItems: 'center' }}>
            На головну
          </Link>
        </div>
      </BdFrame>
    );
  }

  return (
    <BdFrame idx={stepIndex} onBack={stepIndex === 0 ? undefined : back} key="flow">
      <div className="flow-body" key={step}>
        {step === 'age' && (
          <>
            <h2 className="t-h2 flow-q">Скільки років імениннику?</h2>
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
            <h2 className="t-h2 flow-q">Оберіть пакет</h2>
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
            <h2 className="t-h2 flow-q">Тематика свята</h2>
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
            <h2 className="t-h2 flow-q">Скільки буде дітей?</h2>
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
            <h2 className="t-h2 flow-q">Ваше свято</h2>
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

            <h2 className="t-h3" style={{ marginTop: 28 }}>Контакти для бронювання</h2>

            <div className="field">
              <label className="t-label" htmlFor="bdParent">Ваше ім’я</label>
              <input
                id="bdParent"
                className="input"
                value={parentName}
                placeholder="Як до вас звертатися"
                autoComplete="name"
                aria-invalid={touched && !nameOk}
                onChange={(e) => setParentName(e.target.value)}
              />
              {touched && !nameOk && <p className="error">Вкажіть ім’я</p>}
            </div>

            <div className="field">
              <label className="t-label" htmlFor="bdPhone">Телефон</label>
              <input
                id="bdPhone"
                className="input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+380 __ ___ __ __"
                value={phone}
                aria-invalid={touched && !phoneOk}
                onFocus={() => { if (!phone) setPhone('+380 '); }}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              {touched && !phoneOk && <p className="error">Введіть номер у форматі +380 XX XXX XX XX</p>}
            </div>

            <div className="field">
              <label className="t-label" htmlFor="bdChild">Ім’я іменинника (необов’язково)</label>
              <input
                id="bdChild"
                className="input"
                value={childName}
                autoComplete="off"
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="t-label" htmlFor="bdDate">Бажана дата (необов’язково)</label>
              <input
                id="bdDate"
                className="input"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="t-small" style={{ marginTop: 8 }}>Остаточно підтвердимо телефоном.</p>
            </div>

            <p style={{ margin: '18px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink-400)' }}>
              Натискаючи «Забронювати дату», ви погоджуєтесь на обробку контактних даних згідно з <Link href="/polityka-konfidentsiinosti" style={{ color: 'inherit', textDecoration: 'underline' }}>політикою конфіденційності</Link>.
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.viber}
                 style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                Viber
              </a>
              <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.telegram} target="_blank" rel="noopener"
                 style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                Telegram
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
            onClick={() => (step === 'summary' ? submit() : setStep('summary'))}
            disabled={!pkg || sending}
          >
            {step === 'summary' ? (sending ? 'Відправляємо…' : 'Забронювати дату') : 'До підсумку'}
          </button>
        </div>
      )}
    </BdFrame>
  );
}

function BdFrame({ idx, onBack, children }: { idx: number; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="inner">
      <PageHero
        tone="butter"
        crumb="День народження"
        kicker="свято, яке запам’ятається"
        title={<>День <em>народження</em> в TVORCHI</>}
        lead={`Програма, тематика, майстер-клас і солодкий стіл. До ${BIRTHDAY_CAPACITY} дітей комфортно розміщуємо у студії. Зберіть свято за хвилину.`}
        art={<><span className="bd-balloons" aria-hidden="true"><i /><i /><i /></span><Capy size={190} mood="wink" /></>}
      />
      <div className="sheet">
        <div className="sheet-in">
          <div className="flow-top">
            {onBack && <button className="icon-btn" onClick={onBack} aria-label="Назад">←</button>}
            <Steps items={['Вік', 'Пакет', 'Тематика', 'Гості', 'Підсумок']} current={idx} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
