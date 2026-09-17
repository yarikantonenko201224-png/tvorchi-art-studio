'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AGE_GROUPS, PRICES, DAY_SHORT, DAY_FULL, STUDIO, ALL_INCLUSIVE, TRIAL_PRICE, GROUP_SIZE_MAX,
  lessonsByAge, ageGroup,
  type AgeId, type Lesson,
} from '@/lib/data';
import { lessonsWord, formatPhone } from '@/lib/format';

type Step = 'age' | 'catalog' | 'form' | 'done';

export default function BookingPage() {
  const [step, setStep] = useState<Step>('age');
  const [age, setAge] = useState<AgeId | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [childAge, setChildAge] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);

  function begin() {
    if (startedAt === null) setStartedAt(Date.now());
  }

  function pickAge(id: AgeId) {
    begin();
    setAge(id);
    setStep('catalog');
  }

  function pickLesson(l: Lesson) {
    setLesson(l);
    setChildAge(null); // возраст подтверждает родитель, сами не подставляем
    setStep('form');
  }

  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, '').length === 12;
  const ageOk = childAge !== null;
  const formOk = nameOk && phoneOk && ageOk;

  function submit() {
    setTouched(true);
    if (!formOk || sending) return;
    setSending(true);
    // Заявка пока никуда не уходит: здесь будет запись в Supabase
    // и уведомление админу в Telegram.
    window.setTimeout(() => {
      setSeconds(startedAt ? Math.round((Date.now() - startedAt) / 1000) : null);
      setSending(false);
      setStep('done');
    }, 700);
  }

  function reset() {
    setStep('age'); setAge(null); setLesson(null); setChildAge(null);
    setName(''); setPhone(''); setTouched(false);
    setStartedAt(null); setSeconds(null);
  }

  /* ---------------- ВОЗРАСТ ---------------- */
  if (step === 'age') {
    return (
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Скільки років дитині?</h1>
        <p className="t-lead">Від віку залежать напрями та розклад.</p>

        <div className="grid-2">
          {AGE_GROUPS.map((g) => (
            <button key={g.id} className="tile" onClick={() => pickAge(g.id)} style={{ minHeight: 112 }}>
              <span style={{ fontWeight: 900, fontSize: 27, lineHeight: 1, letterSpacing: '-1px' }}>
                {g.title}
              </span>
              <span className="d" style={{ marginTop: 2 }}>{g.note}</span>
            </button>
          ))}
        </div>

        <div className="note">
          <b style={{ color: 'var(--ink-900)' }}>{ALL_INCLUSIVE.title} — {ALL_INCLUSIVE.price} ₴/міс:</b>{' '}
          {ALL_INCLUSIVE.description}. Новим клієнтам зараз −50%.
        </div>
      </div>
    );
  }

  /* ---------------- КАТАЛОГ ---------------- */
  if (step === 'catalog' && age) {
    const group = ageGroup(age);
    const list = lessonsByAge(age);

    return (
      <div className="page">
        <div className="topbar">
          <button className="icon-btn" onClick={() => setStep('age')} aria-label="Назад">←</button>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Заняття для {group.title} років</h1>
        <p className="t-lead">
          {list.length} {lessonsWord(list.length)} на тиждень · тривалість {list[0]?.dur ?? 60} хвилин
        </p>

        {list.map((l) => {
          const p = PRICES[l.tier];
          return (
            <div className="card" key={l.id}>
              <div className="card-head">
                <div>
                  <div className="t-h3">{l.dir}</div>
                  <div className="t-small" style={{ marginTop: 5 }}>
                    {DAY_SHORT[l.day]} · {l.time} · {l.place}
                  </div>
                </div>
                <span className="badge">до {GROUP_SIZE_MAX} дітей</span>
              </div>
              <div className="card-foot">
                <div className="t-small">
                  <span className="t-price" style={{ color: 'var(--ink-900)' }}>{p.single} ₴</span>{' '}
                  разове · абонемент від {p.pack4} ₴
                </div>
                <button className="btn btn--small" onClick={() => pickLesson(l)}>Обрати</button>
              </div>
            </div>
          );
        })}

        <div className="note">
          Є також групи на <b>Молодіжному</b> — англійська, малювання, робототехніка,
          підготовка до школи. Вік груп уточнюємо.
        </div>
      </div>
    );
  }

  /* ---------------- ФОРМА ---------------- */
  if (step === 'form' && lesson && age) {
    const group = ageGroup(age);

    return (
      <>
        <div className="page">
          <div className="topbar">
            <button className="icon-btn" onClick={() => setStep('catalog')} aria-label="Назад">←</button>
          </div>

          <h1 className="t-h1" style={{ marginTop: 18 }}>Пробне заняття</h1>
          <p className="t-lead">
            {TRIAL_PRICE} ₴ · передзвонимо протягом години. Реєстрація не потрібна.
          </p>

          <div
            className="card"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, background: 'var(--surface-soft)', border: 0, marginTop: 20,
            }}
          >
            <div className="t-small">
              <b style={{ display: 'block', color: 'var(--ink-900)', fontSize: 15, fontWeight: 800 }}>
                {lesson.dir}
              </b>
              {DAY_SHORT[lesson.day]} · {lesson.time} · {lesson.place}
            </div>
            <button
              onClick={() => setStep('catalog')}
              style={{
                border: 0, background: 'none', font: 'inherit', fontWeight: 700,
                fontSize: 14, color: 'var(--brand-orange)', cursor: 'pointer', padding: 8,
              }}
            >
              змінити
            </button>
          </div>

          <div className="field">
            <label className="t-label" htmlFor="childName">Ім&apos;я дитини</label>
            <input
              id="childName"
              className="input"
              type="text"
              placeholder="Софія"
              value={name}
              autoComplete="off"
              enterKeyHint="next"
              aria-invalid={touched && !nameOk}
              onChange={(e) => setName(e.target.value)}
            />
            {touched && !nameOk && <p className="error">Вкажіть ім&apos;я дитини</p>}
          </div>

          <div className="field">
            <span className="t-label">Вік дитини</span>
            <div className="chips" role="group" style={{ marginTop: 8 }}>
              {group.years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className="chip"
                  aria-pressed={childAge === y}
                  onClick={() => setChildAge(y)}
                >
                  {y === 13 ? '13+' : y}
                </button>
              ))}
              <button
                type="button"
                className="chip chip--text"
                onClick={() => { setChildAge(null); setStep('age'); }}
              >
                інший вік
              </button>
            </div>
            <p className="t-small" style={{ marginTop: 8 }}>Ця група — для {group.title} років</p>
            {touched && !ageOk && <p className="error">Оберіть вік</p>}
          </div>

          <div className="field">
            <label className="t-label" htmlFor="parentPhone">Ваш телефон</label>
            <input
              id="parentPhone"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+380 __ ___ __ __"
              enterKeyHint="done"
              value={phone}
              aria-invalid={touched && !phoneOk}
              onFocus={() => { if (!phone) setPhone('+380 '); }}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
            {touched && !phoneOk && <p className="error">Введіть номер у форматі +380 XX XXX XX XX</p>}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.viber}
               style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
              Написати у Viber
            </a>
            <a className="btn btn--ghost btn--small btn--wide" href={STUDIO.instagram}
               target="_blank" rel="noopener"
               style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
              Direct
            </a>
          </div>

          <p style={{ margin: '22px 0 0', fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink-400)', textAlign: 'center' }}>
            Натискаючи «Записатися», ви погоджуєтесь на обробку контактних даних для запису на заняття.
          </p>
        </div>

        <div className="bar">
          <button className="btn btn--wide" onClick={submit} disabled={sending || (touched && !formOk)}>
            {sending ? 'Відправляємо…' : 'Записатися'}
          </button>
        </div>
      </>
    );
  }

  /* ---------------- ГОТОВО ---------------- */
  if (step === 'done' && lesson) {
    return (
      <>
        <div className="page">
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ display: 'block', margin: '28px auto 0' }} aria-hidden="true">
            <circle cx="38" cy="38" r="36" fill="#E9F7F7" />
            <path d="M23 39.5 33.5 50 54 27" fill="none" stroke="#12706F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h1 className="t-h2" style={{ textAlign: 'center', marginTop: 16 }}>
            {name.trim()} записана на пробне
          </h1>
          <p className="t-lead" style={{ textAlign: 'center' }}>Передзвонимо протягом години.</p>

          <div className="card" style={{ background: 'var(--surface-soft)', border: 0, marginTop: 20 }}>
            {[
              ['Заняття', lesson.dir],
              ['Коли', `${DAY_FULL[lesson.day]}, ${lesson.time}`],
              ['Локація', lesson.place],
              ['Телефон', phone],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '9px 0', fontSize: 14.5, color: 'var(--ink-500)' }}>
                <span>{k}</span>
                <b style={{ color: 'var(--ink-900)', fontWeight: 700, textAlign: 'right' }}>{v}</b>
              </div>
            ))}
          </div>

          {seconds !== null && (
            <div
              style={{
                marginTop: 20, padding: '13px 16px', borderRadius: 'var(--radius-chip)',
                border: '1.5px dashed var(--border-default)', fontSize: 13, lineHeight: 1.4, color: 'var(--ink-500)',
              }}
            >
              Шлях від входу до заявки:{' '}
              <b style={{ color: 'var(--brand-orange)', fontVariantNumeric: 'tabular-nums' }}>{seconds} с</b>.{' '}
              {seconds <= 60 ? 'Укладається в ціль 60 секунд.' : 'Довше за ціль — є що скорочувати.'}
            </div>
          )}

          <p style={{ margin: '22px 0 0', fontSize: 12.5, color: 'var(--ink-400)', textAlign: 'center' }}>
            Прототип: заявка ще не відправляється в CRM.
          </p>
        </div>

        <div className="bar">
          <button className="btn btn--wide" onClick={reset}>Записати ще одну дитину</button>
        </div>
      </>
    );
  }

  return null;
}
