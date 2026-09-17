'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { masterClassesFor, STUDIO, type MasterClass } from '@/lib/data';
import { masterClassPhoto } from '@/lib/photos';
import {
  masterClassesWord, peopleWord, formatPhone, isPhoneComplete,
} from '@/lib/format';

/* Майстер-класи.

   Раньше это был прайс-лист: человек видел цену и уходил в Direct считать
   сам. Теперь конструктор — выбрал занятие, указал количество участников,
   увидел сумму и оставил заявку. Цены в прайсе указаны за одну людину,
   поэтому умножение на количество здесь обязательно: взрослые почти всегда
   берут компанией. */

type Audience = 'kids' | 'adults';
type Step = 'catalog' | 'form' | 'done';

export default function MasterClassesPage() {
  const [audience, setAudience] = useState<Audience>('kids');
  const [step, setStep] = useState<Step>('catalog');
  const [chosen, setChosen] = useState<MasterClass | null>(null);
  const [people, setPeople] = useState(1);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wish, setWish] = useState('');
  const [touched, setTouched] = useState(false);

  const list = masterClassesFor(audience);
  const price = chosen ? chosen[audience]! : null;
  const total = price ? price.price * people : null;
  const approximate = Boolean(price?.from);
  const totalLabel = total ? `${approximate ? 'від ' : ''}${total.toLocaleString('uk-UA')} ₴` : '—';

  const nameOk = name.trim().length >= 2;
  const phoneOk = isPhoneComplete(phone);
  const formOk = nameOk && phoneOk;

  function submit() {
    setTouched(true);
    if (!formOk) return;
    /* Заявка пока никуда не уходит: здесь будет запись в CRM
       и уведомление администратору. */
    setStep('done');
    window.scrollTo(0, 0);
  }

  /* ---------------- готово ---------------- */
  if (step === 'done' && chosen) {
    return (
      <>
        <div className="page">
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ display: 'block', margin: '40px auto 0' }} aria-hidden="true">
            <circle cx="38" cy="38" r="36" fill="#E9F7F7" />
            <path d="M23 39.5 33.5 50 54 27" fill="none" stroke="#12706F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h1 className="t-h2" style={{ textAlign: 'center', marginTop: 16 }}>Заявку прийнято</h1>
          <p className="t-lead" style={{ textAlign: 'center' }}>
            Зв’яжемося з вами, щоб узгодити дату та час.
          </p>

          <div className="card" style={{ background: 'var(--surface-soft)', border: 0, marginTop: 20 }}>
            {[
              ['Майстер-клас', chosen.title],
              ['Учасників', `${people} ${peopleWord(people)}`],
              ['Разом', totalLabel],
              ['Телефон', phone],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '9px 0', fontSize: 14.5, color: 'var(--ink-500)' }}>
                <span>{k}</span>
                <b style={{ color: 'var(--ink-900)', fontWeight: 700, textAlign: 'right' }}>{v}</b>
              </div>
            ))}
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

  /* ---------------- форма ---------------- */
  if (step === 'form' && chosen && price) {
    return (
      <>
        <div className="page">
          <div className="topbar">
            <button className="icon-btn" onClick={() => setStep('catalog')} aria-label="Назад">←</button>
          </div>

          <h1 className="t-h1" style={{ marginTop: 18 }}>{chosen.title}</h1>
          <p className="t-lead">
            {price.from ? 'від ' : ''}{price.price} ₴ за одного учасника. Усі матеріали входять у вартість.
          </p>

          <div className="field">
            <span className="t-label">Скільки учасників</span>
            <div className="stepper">
              <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Менше">−</button>
              <span className="t-price" style={{ fontSize: 22 }}>{people}</span>
              <button type="button" onClick={() => setPeople((n) => Math.min(20, n + 1))} aria-label="Більше">+</button>
            </div>
            <p className="t-small" style={{ marginTop: 10 }}>
              {people === 1
                ? 'Індивідуальний майстер-клас'
                : `${people} ${peopleWord(people)} × ${price.price} ₴ = ${totalLabel}`}
            </p>
          </div>

          <div className="field">
            <label className="t-label" htmlFor="name">Ваше ім’я</label>
            <input
              id="name"
              className="input"
              value={name}
              placeholder="Як до вас звертатися"
              aria-invalid={touched && !nameOk}
              onChange={(e) => setName(e.target.value)}
            />
            {touched && !nameOk && <p className="error">Вкажіть ім’я</p>}
          </div>

          <div className="field">
            <label className="t-label" htmlFor="phone">Телефон</label>
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

          <div className="field">
            <label className="t-label" htmlFor="wish">Бажана дата або побажання</label>
            <input
              id="wish"
              className="input"
              value={wish}
              placeholder="Наприклад: субота після обіду"
              onChange={(e) => setWish(e.target.value)}
            />
          </div>

          <div className="note" style={{ marginTop: 20 }}>
            Дату узгодимо телефоном — майстер-класи проводимо за записом,
            щоб підготувати матеріали саме на вашу компанію.
          </div>
        </div>

        <div className="bar">
          <div className="bar-info">
            <div className="k">{people} {peopleWord(people)}</div>
            <div className="v">{totalLabel}</div>
          </div>
          <button className="btn" onClick={submit}>Залишити заявку</button>
        </div>
      </>
    );
  }

  /* ---------------- каталог ---------------- */
  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Майстер-класи</h1>
        <p className="t-lead">
          Разові заняття без абонемента. Ціна вказана за одного учасника,
          усі матеріали входять у вартість.
        </p>

        <div
          role="group"
          aria-label="Для кого"
          className="audience-switch"
          style={{
            display: 'flex', gap: 4, marginTop: 20, padding: 4,
            background: 'var(--surface-soft)', borderRadius: 'var(--radius-control)',
          }}
        >
          {([['kids', 'Дітям'], ['adults', 'Дорослим']] as [Audience, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setAudience(id); setChosen(null); }}
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
            корпоратив. Оберіть заняття й вкажіть, скільки вас — порахуємо суму.
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {list.map((m) => {
            const p = m[audience]!;
            const photo = masterClassPhoto(m.slug);
            return (
              <button
                key={m.slug}
                type="button"
                className="option-row"
                aria-pressed={chosen?.slug === m.slug}
                onClick={() => { setChosen(m); setPeople(1); }}
                style={{ gap: 14, minHeight: photo ? 80 : 52 }}
              >
                {photo && (
                  <span className="mk-thumb">
                    <Image src={photo} alt="" fill sizes="56px" style={{ objectFit: 'cover' }} />
                  </span>
                )}
                <span style={{ fontWeight: 600, flex: 1, textAlign: 'left' }}>{m.title}</span>
                <span className="t-price" style={{ whiteSpace: 'nowrap' }}>
                  {p.from && <span style={{ fontWeight: 400, color: 'var(--ink-500)', fontSize: 13 }}>від </span>}
                  {p.price} ₴
                </span>
              </button>
            );
          })}
        </div>

        <div className="note">
          Майстер-клас із робототехніки — це одна зустріч без продовження.
          Регулярні заняття робототехнікою за програмою курсу дивіться в{' '}
          <Link href="/rozklad" style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            розкладі
          </Link>.
        </div>

        <div className="note">
          Майстер-клас можна подарувати —{' '}
          <Link href="/sertyfikaty" style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            оформимо сертифікат
          </Link>{' '}
          на конкретне заняття або на суму.
        </div>
      </div>

      <div className="bar">
        <div className="bar-info">
          <div className="k">{chosen ? chosen.title : `${list.length} ${masterClassesWord(list.length)}`}</div>
          <div className="v">{chosen ? totalLabel : 'Оберіть майстер-клас'}</div>
        </div>
        <button className="btn" disabled={!chosen} onClick={() => setStep('form')}>
          Далі
        </button>
      </div>
    </>
  );
}
