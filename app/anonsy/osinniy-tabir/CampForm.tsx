'use client';

import Link from 'next/link';
import { useState } from 'react';
import Capy from '@/components/Capy';
import { AUTUMN_CAMP as CAMP } from '@/lib/events';
import { formatPhone } from '@/lib/format';
import { sendLead } from '@/lib/send-lead';

const AGES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function CampForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [format, setFormat] = useState(CAMP.formats[0].title);
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, '').length === 12;
  const ok = nameOk && phoneOk && age !== null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!ok || sending) return;
    setSending(true);
    await sendLead({
      source: 'camp',
      childName: name.trim(),
      childAge: age ?? undefined,
      phone,
      direction: CAMP.title,
      payload: { camp: `${CAMP.title}, ${CAMP.dates}`, campFormat: format },
    });
    setSending(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="cp-form cp-form--done" role="status">
        <Capy size={150} hat />
        <h3 className="t-h3">Заявку отримали!</h3>
        <p>
          Ми зателефонуємо найближчим часом, щоб підтвердити місце для {name.trim()} у таборі
          «{CAMP.dates}». До зустрічі, буде страшенно весело!
        </p>
      </div>
    );
  }

  return (
    <form className="cp-form" onSubmit={submit} noValidate data-reveal>
      <div className="field">
        <label className="t-label" htmlFor="campName">Ім&apos;я дитини</label>
        <input
          id="campName" className="input" autoComplete="off" value={name}
          onChange={(e) => setName(e.target.value)} placeholder="Наприклад, Соломія"
          aria-invalid={touched && !nameOk}
        />
      </div>

      <div className="field">
        <span className="t-label">Вік дитини</span>
        <div className="cp-chips" role="group" aria-label="Вік дитини">
          {AGES.map((a) => (
            <button type="button" key={a} className="chip" aria-pressed={age === a} onClick={() => setAge(a)}>
              {a}
            </button>
          ))}
        </div>
        {touched && age === null && <span className="cp-err">Оберіть вік</span>}
      </div>

      <div className="field">
        <span className="t-label">Формат</span>
        <div className="cp-chips" role="group" aria-label="Формат">
          {CAMP.formats.map((f) => (
            <button type="button" key={f.title} className="chip" aria-pressed={format === f.title} onClick={() => setFormat(f.title)}>
              {f.title} · {f.time}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="t-label" htmlFor="campPhone">Ваш телефон</label>
        <input
          id="campPhone" className="input" type="tel" inputMode="tel" autoComplete="tel"
          value={phone || ''} placeholder="+380 __ ___ __ __"
          onFocus={() => !phone && setPhone('+380')}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          aria-invalid={touched && !phoneOk}
        />
        {touched && !phoneOk && <span className="cp-err">Перевірте номер</span>}
      </div>

      <button className="btn btn--wide" type="submit" disabled={sending}>
        {sending ? 'Надсилаємо…' : 'Записатися в табір'}
      </button>
      <p className="cp-fine">Натискаючи кнопку, ви погоджуєтесь з <Link href="/polityka-konfidentsiinosti" style={{ color: 'inherit', textDecoration: 'underline' }}>політикою конфіденційності</Link>.</p>
    </form>
  );
}
