'use client';

import { useState } from 'react';
import Link from 'next/link';
import { masterClassesFor, PRICES, STUDIO, TRIAL_PRICE } from '@/lib/data';
import { formatPhone, isPhoneComplete, isEmail, peopleWord, childrenWord } from '@/lib/format';

/* Подарочный сертификат.

   В ТЗ это была форма заявки с полем «вид сертифіката». Но даритель
   не знает ассортимент наизусть: для взрослого сертификата он выбирает
   мастер-класс и количество участников (дівич-вечір, зустріч подруг,
   корпоратив) и хочет видеть сумму сразу. Поэтому конструктор с живым
   подсчётом в липкой панели, а не поле для ввода.

   Правила из документа владелицы:
   • срок действия — 3 месяца с момента покупки;
   • денежный номинал можно тратить частями, остаток не сгорает до конца срока;
   • разница не возвращается, но доплатить можно. */

type Recipient = 'kids' | 'adults';
type Kind = 'lesson' | 'masterclass' | 'individual' | 'other' | 'amount';
type Format = 'digital' | 'printed';

const LESSON_OPTIONS = [
  { id: 'trial', label: 'Пробне заняття', price: TRIAL_PRICE },
  { id: 'single', label: 'Разове заняття', price: PRICES.std.single },
  { id: 'pack4', label: 'Абонемент на 4 заняття', price: PRICES.std.pack4 },
  { id: 'pack8', label: 'Абонемент на 8 занять', price: PRICES.std.pack8 },
  { id: 'pack12', label: 'Абонемент на 12 занять', price: PRICES.std.pack12 },
];

const AMOUNT_PRESETS = [1000, 1500, 2000];

const KIND_LABELS: Record<Kind, string> = {
  lesson: 'Заняття або абонемент',
  masterclass: 'Майстер-клас',
  individual: 'Індивідуальне заняття з малювання',
  other: 'Інша активність',
  amount: 'На суму',
};

export default function CertificatesPage() {
  const [recipient, setRecipient] = useState<Recipient>('kids');
  const [kind, setKind] = useState<Kind>('masterclass');
  const [lessonId, setLessonId] = useState(LESSON_OPTIONS[2].id);
  const [mcSlug, setMcSlug] = useState('');
  const [people, setPeople] = useState(1);
  const [amount, setAmount] = useState('');
  const [format, setFormat] = useState<Format>('digital');

  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const kinds: Kind[] =
    recipient === 'kids'
      ? ['lesson', 'masterclass', 'other', 'amount']
      : ['individual', 'masterclass', 'other', 'amount'];

  const catalog = masterClassesFor(recipient);
  const chosenMc = catalog.find((m) => m.slug === mcSlug) ?? catalog[0];
  const chosenLesson = LESSON_OPTIONS.find((l) => l.id === lessonId)!;

  /* ---- сумма ---- */
  let total: number | null = null;
  let approximate = false;

  if (kind === 'lesson') {
    total = chosenLesson.price;
  } else if (kind === 'masterclass' && chosenMc) {
    const p = chosenMc[recipient]!;
    total = p.price * people;
    approximate = Boolean(p.from);
  } else if (kind === 'amount') {
    const n = Number(amount.replace(/\D/g, ''));
    total = n > 0 ? n : null;
  }

  const priceUnknown = kind === 'individual' || kind === 'other';
  const totalLabel = priceUnknown
    ? 'уточнимо'
    : total
      ? `${approximate ? 'від ' : ''}${total.toLocaleString('uk-UA')} ₴`
      : '—';

  const nameOk = toName.trim().length >= 2;
  const phoneOk = isPhoneComplete(phone);
  const emailOk = format === 'printed' ? true : isEmail(email);
  const amountOk = kind !== 'amount' || (total ?? 0) > 0;
  const formOk = nameOk && phoneOk && emailOk && amountOk;

  function submit() {
    setTouched(true);
    if (!formOk) return;
    /* Заявка пока никуда не уходит: здесь будет запись в CRM
       и уведомление администратору. */
    setSent(true);
    window.scrollTo(0, 0);
  }

  /* ---------------- готово ---------------- */
  if (sent) {
    return (
      <>
        <div className="page">
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ display: 'block', margin: '40px auto 0' }} aria-hidden="true">
            <circle cx="38" cy="38" r="36" fill="#E9F7F7" />
            <path d="M23 39.5 33.5 50 54 27" fill="none" stroke="#12706F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="t-h2" style={{ textAlign: 'center', marginTop: 16 }}>Заявку прийнято</h1>
          <p className="t-lead" style={{ textAlign: 'center' }}>
            Зв’яжемося з вами найближчим часом, підтвердимо суму та спосіб оплати.
          </p>

          <div className="card" style={{ background: 'var(--surface-soft)', border: 0, marginTop: 20 }}>
            {[
              ['Кому', recipient === 'kids' ? 'Дитині' : 'Дорослому'],
              ['Що', KIND_LABELS[kind]],
              ['Формат', format === 'digital' ? 'Електронний' : 'Друкований'],
              ['Отримувач', toName],
              ['Сума', totalLabel],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '9px 0', fontSize: 14.5, color: 'var(--ink-500)' }}>
                <span>{k}</span>
                <b style={{ color: 'var(--ink-900)', fontWeight: 700, textAlign: 'right' }}>{v}</b>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 18 }}>
            {format === 'digital'
              ? 'Електронний сертифікат надішлемо на вашу пошту після оплати.'
              : 'Друкований сертифікат підготуємо в студії — скажемо, коли можна забрати.'}
          </div>

          <p className="t-small" style={{ marginTop: 18, textAlign: 'center' }}>
            Прототип: заявка ще не відправляється в CRM.
          </p>
        </div>

        <div className="bar">
          <Link className="btn btn--wide" href="/i" style={{ display: 'grid', placeItems: 'center' }}>
            На головну
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Подарунковий сертифікат</h1>
        <p className="t-lead">
          Творчий подарунок для дитини або дорослого. Зберіть сертифікат —
          ми підготуємо його в електронному або друкованому вигляді.
        </p>

        {/* 1. Кому */}
        <div className="field">
          <span className="t-label">Кому сертифікат</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {([['kids', 'Дитині'], ['adults', 'Дорослому']] as [Recipient, string][]).map(
              ([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="chip chip--text"
                  aria-pressed={recipient === id}
                  onClick={() => {
                    setRecipient(id);
                    setMcSlug('');
                    setKind(id === 'kids' ? 'lesson' : 'individual');
                  }}
                  style={{ minHeight: 48 }}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        {/* 2. Что дарим */}
        <div className="field">
          <span className="t-label">Що дарувати</span>
          <div style={{ marginTop: 8 }}>
            {kinds.map((id) => (
              <button
                key={id}
                type="button"
                className="option-row"
                aria-pressed={kind === id}
                onClick={() => setKind(id)}
              >
                <span>{KIND_LABELS[id]}</span>
                <span className="pick-mark" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* 3. Детали */}
        {kind === 'masterclass' && chosenMc && (
          <>
            <div className="field">
              <label className="t-label" htmlFor="mc">Який майстер-клас</label>
              <select id="mc" className="input" value={chosenMc.slug} onChange={(e) => setMcSlug(e.target.value)}>
                {catalog.map((m) => {
                  const p = m[recipient]!;
                  return (
                    <option key={m.slug} value={m.slug}>
                      {m.title} — {p.from ? 'від ' : ''}{p.price} ₴
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="field">
              <span className="t-label">Скільки учасників</span>
              <div className="stepper">
                <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Менше">−</button>
                <span className="t-price" style={{ fontSize: 22 }}>{people}</span>
                <button type="button" onClick={() => setPeople((n) => Math.min(20, n + 1))} aria-label="Більше">+</button>
              </div>
              {/* Подсказка зависит от того, кому сертификат: девичник
                  в детском сценарии звучит абсурдно. */}
              <p className="t-small" style={{ marginTop: 10 }}>
                {people === 1
                  ? (recipient === 'kids'
                      ? 'Сертифікат на одну дитину'
                      : 'Сертифікат на одну людину')
                  : (recipient === 'kids'
                      ? `Сертифікат на ${people} ${childrenWord(people)} — наприклад, для друзів або братів і сестер`
                      : `Компанія з ${people} ${peopleWord(people)} — зручно для дівич-вечора, зустрічі подруг або корпоративу`)}
              </p>
            </div>
          </>
        )}

        {kind === 'lesson' && (
          <div className="field">
            <span className="t-label">Формат занять</span>
            <div style={{ marginTop: 8 }}>
              {LESSON_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="option-row"
                  aria-pressed={lessonId === l.id}
                  onClick={() => setLessonId(l.id)}
                >
                  <span>{l.label}</span>
                  <span className="t-price">{l.price} ₴</span>
                </button>
              ))}
            </div>
            <p className="t-small" style={{ marginTop: 10 }}>
              Сертифікат діє на будь-який напрям студії. Робототехніка дорожча —
              перерахуємо при оформленні.
            </p>
          </div>
        )}

        {kind === 'individual' && (
          <div className="note" style={{ marginTop: 18 }}>
            Індивідуальне заняття з малювання: викладач працює один на один
            і підлаштовує програму під рівень і темп. Вартість підкаже адміністратор.
          </div>
        )}

        {kind === 'other' && (
          <div className="field">
            <label className="t-label" htmlFor="other">Яка саме активність</label>
            <input
              id="other"
              className="input"
              placeholder="Напишіть, що маєте на увазі"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="t-small" style={{ marginTop: 10 }}>
              Підберемо формат і порахуємо вартість разом із вами.
            </p>
          </div>
        )}

        {kind === 'amount' && (
          <div className="field">
            <span className="t-label">Сума сертифіката</span>
            <div className="chips" style={{ marginTop: 8 }}>
              {AMOUNT_PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="chip chip--text"
                  aria-pressed={amount === String(v)}
                  onClick={() => setAmount(String(v))}
                  style={{ minHeight: 48 }}
                >
                  {v} ₴
                </button>
              ))}
            </div>
            <input
              className="input"
              style={{ marginTop: 10 }}
              inputMode="numeric"
              placeholder="Інша сума, наприклад 750"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            {touched && !amountOk && <p className="error">Вкажіть суму сертифіката</p>}
            <p className="t-small" style={{ marginTop: 10 }}>
              Суму можна витрачати частинами: якщо послуга дешевша за номінал,
              залишок лишається на сертифікаті до кінця терміну дії.
            </p>
          </div>
        )}

        {/* 4. Формат */}
        <div className="field">
          <span className="t-label">Формат сертифіката</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {([['digital', 'Електронний'], ['printed', 'Друкований']] as [Format, string][]).map(
              ([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="chip chip--text"
                  aria-pressed={format === id}
                  onClick={() => setFormat(id)}
                  style={{ minHeight: 48 }}
                >
                  {label}
                </button>
              ),
            )}
          </div>
          <p className="t-small" style={{ marginTop: 10 }}>
            {format === 'digital'
              ? 'Надішлемо на e-mail після оплати — можна подарувати того ж дня.'
              : 'Надрукуємо і віддамо в студії.'}
          </p>
        </div>

        {/* 5. Данные */}
        <h2 className="t-h3" style={{ marginTop: 30 }}>Дані для оформлення</h2>

        <div className="field">
          <label className="t-label" htmlFor="toName">Ім’я отримувача</label>
          <input
            id="toName"
            className="input"
            placeholder="Для кого сертифікат"
            value={toName}
            aria-invalid={touched && !nameOk}
            onChange={(e) => setToName(e.target.value)}
          />
          {touched && !nameOk && <p className="error">Вкажіть, для кого сертифікат</p>}
        </div>

        <div className="field">
          <label className="t-label" htmlFor="fromName">Від кого — за бажанням</label>
          <input
            id="fromName"
            className="input"
            placeholder="Ваше ім’я"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="t-label" htmlFor="phone">Ваш телефон</label>
          <input
            id="phone"
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

        {format === 'digital' && (
          <div className="field">
            <label className="t-label" htmlFor="email">E-mail для сертифіката</label>
            <input
              id="email"
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="pochta@example.com"
              value={email}
              aria-invalid={touched && !emailOk}
              onChange={(e) => setEmail(e.target.value)}
            />
            {touched && !emailOk && <p className="error">Перевірте адресу пошти</p>}
          </div>
        )}

        <div className="note" style={{ marginTop: 24 }}>
          <b style={{ color: 'var(--ink-900)' }}>Як це працює.</b> Сертифікат дійсний
          3 місяці з моменту придбання. Якщо він на суму, її можна витрачати частинами:
          залишок зберігається до кінця терміну. Якщо послуга дорожча за номінал —
          різницю можна доплатити.
        </div>
      </div>

      <div className="bar">
        <div className="bar-info">
          <div className="k">Сертифікат</div>
          <div className="v">{totalLabel}</div>
        </div>
        <button className="btn" onClick={submit}>Замовити</button>
      </div>
    </>
  );
}
