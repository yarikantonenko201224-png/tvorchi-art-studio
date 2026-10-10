'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero, { Steps } from '@/components/PageHero';
import Image from 'next/image';
import { masterClassesFor, STUDIO, type MasterClass } from '@/lib/data';
import {
  masterClassesWord, peopleWord, formatPhone, isPhoneComplete,
} from '@/lib/format';
import { sendLead } from '@/lib/send-lead';

/* Майстер-класи.

   Раньше это был прайс-лист: человек видел цену и уходил в Direct считать
   сам. Теперь конструктор — выбрал занятие, указал количество участников,
   увидел сумму и оставил заявку. Цены в прайсе указаны за одну людину,
   поэтому умножение на количество здесь обязательно: взрослые почти всегда
   берут компанией. */

type Audience = 'kids' | 'adults';
type Step = 'catalog' | 'form' | 'done';

export default function MasterClassesClient({ photos }: { photos: Record<string, string> }) {
  const masterClassPhoto = (slug: string): string | null => photos[slug] ?? null;
  const [audience, setAudience] = useState<Audience>('kids');
  const [step, setStep] = useState<Step>('catalog');
  const [chosen, setChosen] = useState<MasterClass | null>(null);
  const [people, setPeople] = useState(1);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wish, setWish] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  /* Сначала те, у которых есть фото. Вперемешку с цветными заглушками
     они читаются как «картинка не загрузилась»; сверху фото — снизу
     ровный блок заглушек, и это выглядит как осознанное деление
     на популярные и остальные. */
  const list = [...masterClassesFor(audience)].sort((a, b) => {
    const pa = masterClassPhoto(a.slug) ? 0 : 1;
    const pb = masterClassPhoto(b.slug) ? 0 : 1;
    return pa - pb;
  });
  const price = chosen ? chosen[audience]! : null;
  const total = price ? price.price * people : null;
  const approximate = Boolean(price?.from);
  const totalLabel = total ? `${approximate ? 'від ' : ''}${total.toLocaleString('uk-UA')} ₴` : '—';

  const nameOk = name.trim().length >= 2;
  const phoneOk = isPhoneComplete(phone);
  const formOk = nameOk && phoneOk;

  async function submit() {
    setTouched(true);
    if (!formOk || sending || !chosen) return;
    setSending(true);
    await sendLead({
      source: 'masterclass',
      parentName: name.trim(),
      phone,
      direction: chosen.title,
      people,
      amount: total ?? undefined,
      payload: {
        slug: chosen.slug,
        audience: audience === 'kids' ? 'діти' : 'дорослі',
        pricePerPerson: price?.price,
        priceFrom: approximate,
        wish: wish.trim() || undefined,
      },
    });
    setSending(false);
    setStep('done');
    window.scrollTo(0, 0);
  }

  /* ---------------- готово ---------------- */
  if (step === 'done' && chosen) {
    return (
      <MkFrame boxed>
        <div>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ display: 'block', margin: '20px auto 0' }} aria-hidden="true">
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

        </div>

        <div className="bar">
          <Link className="btn btn--wide" href="/" style={{ display: 'grid', placeItems: 'center' }}>
            На головну
          </Link>
        </div>
      </MkFrame>
    );
  }

  /* ---------------- форма ---------------- */
  if (step === 'form' && chosen && price) {
    return (
      <MkFrame boxed>
        <div className="flow-body">
          <div className="flow-top">
            <button className="icon-btn" onClick={() => setStep('catalog')} aria-label="Назад">←</button>
            <Steps items={['Майстер-клас', 'Контакти', 'Готово']} current={1} />
          </div>

          <h2 className="t-h2 flow-q">{chosen.title}</h2>
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
          <button className="btn" onClick={submit} disabled={sending}>
            {sending ? 'Відправляємо…' : 'Залишити заявку'}
          </button>
        </div>
      </MkFrame>
    );
  }

  /* ---------------- каталог ---------------- */
  return (
    <MkFrame>
      <div className="page">
        <div className="sc-tabs mk-tabs" role="tablist" aria-label="Для кого">
          {([['kids', 'Дітям'], ['adults', 'Дорослим']] as [Audience, string][]).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={audience === id} onClick={() => { setAudience(id); setChosen(null); }}>
              {label}
            </button>
          ))}
          <span className="sc-tabs-pill" style={{ transform: `translateX(${audience === 'kids' ? 0 : 100}%)` }} aria-hidden="true" />
        </div>

        {audience === 'adults' && (
          <div className="note" style={{ marginTop: 16 }}>
            Дорослі майстер-класи часто беруть компанією: дівич-вечір, зустріч подруг,
            корпоратив. Оберіть заняття й вкажіть, скільки вас — порахуємо суму.
          </div>
        )}

        <div className="mk-grid">
          {list.map((m, i) => {
            const p = m[audience]!;
            const photo = masterClassPhoto(m.slug);
            const selected = chosen?.slug === m.slug;
            const sum = p.price * (selected ? people : 1);

            return (
              <article
                key={m.slug}
                className={`mk-card${selected ? ' is-selected' : ''}`}
                data-tint={i % 4}
              >
                <button
                  type="button"
                  className="mk-card-main"
                  aria-pressed={selected}
                  onClick={() => { setChosen(selected ? null : m); setPeople(1); }}
                >
                  <span className="mk-cover">
                    {photo ? (
                      <Image src={photo} alt="" fill sizes="(max-width:900px) 45vw, 260px" style={{ objectFit: 'cover' }} />
                    ) : (
                      <span className="mk-cover-mark" data-ch={m.title.slice(0, 1)} aria-hidden="true" />
                    )}
                  </span>

                  <span className="mk-title">{m.title}</span>
                  <span className="mk-price">
                    {p.from && <span className="mk-from">від </span>}
                    {p.price} ₴
                    <span className="mk-per"> / особа</span>
                  </span>
                </button>

                {/* Счётчик раскрывается прямо в карточке: прятать его
                    за следующим шагом значило, что о нём никто не узнает. */}
                {selected && (
                  <div className="mk-pick">
                    <div className="stepper">
                      <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Менше">−</button>
                      <span className="t-price" style={{ fontSize: 20 }}>{people}</span>
                      <button type="button" onClick={() => setPeople((n) => Math.min(20, n + 1))} aria-label="Більше">+</button>
                    </div>

                    <div className="mk-sum">
                      <span className="t-small">{people} {peopleWord(people)}</span>
                      <span className="t-price" style={{ fontSize: 20 }}>
                        {p.from ? 'від ' : ''}{sum.toLocaleString('uk-UA')} ₴
                      </span>
                    </div>

                    <button className="btn btn--small btn--wide" onClick={() => setStep('form')}>
                      Записатися
                    </button>
                  </div>
                )}
              </article>
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

      {/* Нижняя панель нужна, только пока ничего не выбрано: после выбора
          кнопка записи появляется прямо в карточке, у суммы. */}
      {!chosen && (
        <div className="bar">
          <div className="bar-info">
            <div className="k">{list.length} {masterClassesWord(list.length)}</div>
            <div className="v">Оберіть майстер-клас</div>
          </div>
          <a className="btn btn--ghost btn--small" href={STUDIO.viber}
             style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
            Запитати
          </a>
        </div>
      )}
    </MkFrame>
  );
}

function MkFrame({ boxed = false, children }: { boxed?: boolean; children: React.ReactNode }) {
  return (
    <div className="inner">
      <PageHero
        tone="pink"
        crumb="Майстер-класи"
        kicker="разові, без абонемента"
        title={<>Майстер-<em>класи</em></>}
        lead="Для дітей і дорослих: глина, неонове малювання, розпис пряників, бенто-торти та інше. Ціна за одного учасника, усі матеріали входять у вартість."
        stickers={[
          { big: 'від 150 ₴', small: 'за учасника', color: '#FFF1BF' },
          { big: '👩‍👧', small: 'дітям і дорослим', color: '#D9F4EC' },
          { big: '🎁', small: 'можна подарувати', color: '#ECE4FF' },
        ]}
      />
      <div className={`sheet${boxed ? '' : ' sheet--open'}`}>
        {boxed ? <div className="sheet-in">{children}</div> : children}
      </div>
    </div>
  );
}
