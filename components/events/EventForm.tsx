'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Capy from '@/components/Capy';
import { formatPhone } from '@/lib/format';
import { sendLead } from '@/lib/send-lead';
import type { LeadSource } from '@/lib/leads';

/* Короткая форма заявки для спецпроєктів (вечірки, поїздки).
   Набор полей задаётся пропсами; выбор в группе можно выставить снаружи
   событием `event-form:set` — так карточка темы сразу отмечает её в форме. */

export interface ChipGroup {
  key: string;
  label: string;
  options: string[];
  multi?: boolean;
  required?: boolean;
  initial?: string;
}

export function pickInForm(key: string, value: string) {
  window.dispatchEvent(new CustomEvent('event-form:set', { detail: { key, value } }));
  document.getElementById('zapys')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function EventForm({
  source, event, groups = [], count, withDate = false, nameLabel = 'Ваше ім’я',
  namePlaceholder = 'Як до вас звертатися', submitLabel = 'Надіслати заявку', doneText,
}: {
  source: LeadSource;
  event: string;
  groups?: ChipGroup[];
  count?: { key: string; label: string; min: number; max: number; initial: number };
  withDate?: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  submitLabel?: string;
  doneText: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [n, setN] = useState(count?.initial ?? 1);
  const [picked, setPicked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(groups.map((g) => [g.key, g.initial ? [g.initial] : []])),
  );
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const on = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail ?? {};
      if (key in picked) setPicked((p) => ({ ...p, [key]: [value] }));
    };
    window.addEventListener('event-form:set', on);
    return () => window.removeEventListener('event-form:set', on);
  }, [picked]);

  function toggle(g: ChipGroup, v: string) {
    setPicked((p) => {
      const cur = p[g.key] ?? [];
      if (!g.multi) return { ...p, [g.key]: [v] };
      return { ...p, [g.key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  }

  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, '').length === 12;
  const groupsOk = groups.every((g) => !g.required || (picked[g.key]?.length ?? 0) > 0);
  const ok = nameOk && phoneOk && groupsOk;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!ok || sending) return;
    setSending(true);
    const payload: Record<string, unknown> = { event };
    groups.forEach((g) => { if (picked[g.key]?.length) payload[g.key] = picked[g.key].join(', '); });
    if (count) payload[count.key] = n;
    if (withDate && date) payload.date = date.split('-').reverse().join('.');
    await sendLead({
      source, phone, parentName: name.trim(), direction: event,
      people: count ? n : undefined, payload,
    });
    setSending(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="ev-form ev-form--done" role="status">
        <Capy size={150} mood="wink" />
        <h3 className="t-h3">Заявку отримали!</h3>
        <p>{doneText}</p>
      </div>
    );
  }

  return (
    <form className="ev-form" onSubmit={submit} noValidate>
      {groups.map((g) => (
        <div className="field" key={g.key}>
          <span className="t-label">{g.label}</span>
          <div className="ev-chips" role="group" aria-label={g.label}>
            {g.options.map((o) => (
              <button type="button" key={o} className="chip" aria-pressed={picked[g.key]?.includes(o) ?? false} onClick={() => toggle(g, o)}>
                {o}
              </button>
            ))}
          </div>
          {touched && g.required && !picked[g.key]?.length && <span className="ev-err">Оберіть варіант</span>}
        </div>
      ))}

      {(count || withDate) && (
        <div className="ev-row">
          {count && (
            <div className="field">
              <span className="t-label">{count.label}</span>
              <div className="ev-step">
                <button type="button" onClick={() => setN((v) => Math.max(count.min, v - 1))} aria-label="Менше">−</button>
                <b aria-live="polite">{n}</b>
                <button type="button" onClick={() => setN((v) => Math.min(count.max, v + 1))} aria-label="Більше">+</button>
              </div>
            </div>
          )}
          {withDate && (
            <div className="field">
              <label className="t-label" htmlFor={`${source}Date`}>Бажана дата</label>
              <input id={`${source}Date`} className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}
        </div>
      )}

      <div className="field">
        <label className="t-label" htmlFor={`${source}Name`}>{nameLabel}</label>
        <input id={`${source}Name`} className="input" autoComplete="name" value={name}
          onChange={(e) => setName(e.target.value)} placeholder={namePlaceholder} aria-invalid={touched && !nameOk} />
        {touched && !nameOk && <span className="ev-err">Вкажіть ім’я</span>}
      </div>

      <div className="field">
        <label className="t-label" htmlFor={`${source}Phone`}>Телефон</label>
        <input id={`${source}Phone`} className="input" type="tel" inputMode="tel" autoComplete="tel"
          value={phone} placeholder="+380 __ ___ __ __"
          onFocus={() => !phone && setPhone('+380')}
          onChange={(e) => setPhone(formatPhone(e.target.value))} aria-invalid={touched && !phoneOk} />
        {touched && !phoneOk && <span className="ev-err">Перевірте номер</span>}
      </div>

      <button className="btn btn--wide" type="submit" disabled={sending}>
        {sending ? 'Надсилаємо…' : submitLabel}
      </button>
      <p className="ev-fine">Ми зателефонуємо, щоб усе уточнити. Надсилаючи заявку, ви погоджуєтесь з <Link href="/polityka-konfidentsiinosti" style={{ color: 'inherit', textDecoration: 'underline' }}>політикою конфіденційності</Link>.</p>
    </form>
  );
}
