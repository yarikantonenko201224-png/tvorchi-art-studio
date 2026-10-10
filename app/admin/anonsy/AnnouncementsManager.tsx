'use client';

import { useState } from 'react';
import { uploadImage, adminFetch } from '@/lib/resize-image';
import DeleteButton from '@/components/admin/DeleteButton';

export interface EditableAnnouncement {
  id: string;
  title: string;
  starts_at: string;  // «2026-09-20T13:00», киевское время — формат поля datetime-local
  ends_at: string;
  place: string;
  age: string;
  short: string;
  full_text: string;
  price: string;
  seats: string;
  link: string;
  active: boolean;
  cover_path: string;
  cover_url: string;
  past: boolean;
}

const EMPTY: EditableAnnouncement = {
  id: '', title: '', starts_at: '', ends_at: '', place: '', age: '', short: '', full_text: '',
  price: '', seats: '', link: '', active: true, cover_path: '', cover_url: '', past: false,
};

const PLACES = ['Раківка', 'Молодіжний, вул. Лесі Українки, 37А', 'Раківка та Молодіжний'];

function when(a: EditableAnnouncement): string {
  if (!a.starts_at) return '';
  const d = new Date(`${a.starts_at}:00`);
  const date = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'short' });
  const time = a.starts_at.slice(11, 16);
  return time && time !== '00:00' ? `${date}, ${time}` : date;
}

export default function AnnouncementsManager({ initial }: { initial: EditableAnnouncement[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<EditableAnnouncement | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EditableAnnouncement>(k: K, v: EditableAnnouncement[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  async function onCover(file: File | undefined) {
    if (!file || !form) return;
    setError(null);
    setUploading(true);
    try {
      const { path, url } = await uploadImage(file, 'announcements');
      setForm((f) => (f ? { ...f, cover_path: path, cover_url: url } : f));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form) return;
    setError(null);
    if (!form.title.trim()) return setError('Вкажіть назву події');
    if (!form.starts_at) return setError('Вкажіть дату й час початку');
    setSaving(true);
    try {
      await adminFetch('/api/admin/announcements', {
        method: 'POST',
        body: JSON.stringify({ ...form, id: form.id || undefined }),
      });
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  async function toggle(a: EditableAnnouncement) {
    setError(null);
    setItems((xs) => xs.map((x) => (x.id === a.id ? { ...x, active: !a.active } : x)));
    try {
      await adminFetch('/api/admin/announcements', { method: 'PATCH', body: JSON.stringify({ id: a.id, active: !a.active }) });
    } catch (e) {
      setItems((xs) => xs.map((x) => (x.id === a.id ? a : x)));
      setError((e as Error).message);
    }
  }

  async function del(id: string) {
    setError(null);
    const before = items;
    setItems((xs) => xs.filter((x) => x.id !== id));
    try {
      await adminFetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      setItems(before);
      setError((e as Error).message);
    }
  }

  /* ---------- форма ---------- */
  if (form) {
    return (
      <div className="admin-form">
        <h2 className="t-h3" style={{ marginTop: 20 }}>{form.id ? 'Редагування події' : 'Нова подія'}</h2>

        <div className="field">
          <label className="t-label" htmlFor="a-title">Назва *</label>
          <input id="a-title" className="input" value={form.title} maxLength={120}
                 placeholder="День відкритих дверей" onChange={(e) => set('title', e.target.value)} />
        </div>

        <div className="admin-2col">
          <div className="field">
            <label className="t-label" htmlFor="a-start">Початок *</label>
            <input id="a-start" className="input" type="datetime-local" value={form.starts_at}
                   onChange={(e) => set('starts_at', e.target.value)} />
          </div>
          <div className="field">
            <label className="t-label" htmlFor="a-end">Завершення</label>
            <input id="a-end" className="input" type="datetime-local" value={form.ends_at} min={form.starts_at}
                   onChange={(e) => set('ends_at', e.target.value)} />
            <p className="t-small" style={{ marginTop: 6 }}>Порожньо — до кінця дня початку. Для акцій — дата закінчення.</p>
          </div>
        </div>

        <div className="field">
          <label className="t-label" htmlFor="a-place">Місце</label>
          <input id="a-place" className="input" list="a-places" value={form.place} maxLength={120}
                 onChange={(e) => set('place', e.target.value)} />
          <datalist id="a-places">{PLACES.map((p) => <option key={p} value={p} />)}</datalist>
        </div>

        <div className="admin-2col">
          <div className="field">
            <label className="t-label" htmlFor="a-age">Вік</label>
            <input id="a-age" className="input" value={form.age} maxLength={60} placeholder="4–10 років"
                   onChange={(e) => set('age', e.target.value)} />
          </div>
          <div className="field">
            <label className="t-label" htmlFor="a-price">Вартість</label>
            <input id="a-price" className="input" value={form.price} maxLength={120} placeholder="350 ₴ або «безкоштовно»"
                   onChange={(e) => set('price', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="t-label" htmlFor="a-short">Коротко (1–2 речення для картки)</label>
          <textarea id="a-short" className="input" rows={2} value={form.short} maxLength={300}
                    onChange={(e) => set('short', e.target.value)} />
        </div>

        <div className="field">
          <label className="t-label" htmlFor="a-full">Детальний опис</label>
          <textarea id="a-full" className="input" rows={5} value={form.full_text} maxLength={3000}
                    onChange={(e) => set('full_text', e.target.value)} />
        </div>

        <div className="admin-2col">
          <div className="field">
            <label className="t-label" htmlFor="a-seats">Вільних місць</label>
            <input id="a-seats" className="input" type="number" min={0} inputMode="numeric" value={form.seats}
                   onChange={(e) => set('seats', e.target.value)} />
            <p className="t-small" style={{ marginTop: 6 }}>Порожньо — не показувати. 0 — «місць немає».</p>
          </div>
          <div className="field">
            <label className="t-label" htmlFor="a-link">Посилання (необов’язково)</label>
            <input id="a-link" className="input" type="url" value={form.link} maxLength={300}
                   placeholder="https://www.instagram.com/p/…" onChange={(e) => set('link', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <span className="t-label">Афіша</span>
          <div className="admin-cover">
            {form.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover_url} alt="" />
            ) : (
              <span className="admin-empty">Без афіші</span>
            )}
          </div>
          <div className="admin-row" style={{ marginTop: 8 }}>
            <label className="admin-link" style={{ cursor: 'pointer' }}>
              {uploading ? 'Завантажуємо…' : form.cover_url ? 'Замінити афішу' : 'Додати афішу'}
              <input type="file" accept="image/*" hidden disabled={uploading}
                     onChange={(e) => onCover(e.target.files?.[0])} />
            </label>
            {form.cover_url && (
              <button type="button" className="admin-link admin-link--danger"
                      onClick={() => setForm((f) => (f ? { ...f, cover_path: '', cover_url: '' } : f))}>
                Прибрати
              </button>
            )}
          </div>
        </div>

        <label className="admin-check" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
          Показувати на сайті
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="admin-row" style={{ marginTop: 20, gap: 10 }}>
          <button type="button" className="btn" onClick={save} disabled={saving || uploading}>
            {saving ? 'Зберігаємо…' : 'Зберегти'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => { setForm(null); setError(null); }} disabled={saving}>
            Скасувати
          </button>
        </div>
      </div>
    );
  }

  /* ---------- список ---------- */
  const current = items.filter((a) => !a.past);
  const past = items.filter((a) => a.past);

  const renderItem = (a: EditableAnnouncement) => (
    <article key={a.id} className={`admin-event${a.active ? '' : ' is-hidden'}`}>
      {a.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="admin-event-cover" src={a.cover_url} alt="" loading="lazy" />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="admin-card-title">{a.title}</div>
        <div className="t-small" style={{ marginTop: 4 }}>
          {when(a)}{a.place ? ` · ${a.place}` : ''}{!a.active ? ' · приховано' : ''}
        </div>
        <div className="admin-row" style={{ marginTop: 8 }}>
          <button type="button" className="admin-link" onClick={() => { setError(null); setForm(a); }}>Редагувати</button>
          {!a.past && (
            <button type="button" className="admin-link" onClick={() => toggle(a)}>{a.active ? 'Сховати' : 'Показати'}</button>
          )}
          <DeleteButton onConfirm={() => del(a.id)} />
        </div>
      </div>
    </article>
  );

  return (
    <>
      <div className="admin-toolbar">
        <button type="button" className="btn" onClick={() => { setError(null); setForm({ ...EMPTY }); }}>
          + Нова подія
        </button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      <h2 className="t-h3" style={{ marginTop: 24 }}>Актуальні</h2>
      {current.length ? current.map(renderItem) : (
        <div className="note">Немає запланованих подій — сторінка «Анонси» запропонує підписатися на Instagram.</div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="t-h3" style={{ marginTop: 32 }}>Минулі</h2>
          {past.map(renderItem)}
        </>
      )}
    </>
  );
}
