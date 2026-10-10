'use client';

import { useRef, useState } from 'react';
import { uploadImage, adminFetch } from '@/lib/resize-image';
import DeleteButton from '@/components/admin/DeleteButton';
import type { GalleryRow } from '@/lib/content';

type Item = GalleryRow & { url: string };

/* Управление галереей с телефона:
   «Додати фото» → выбрать несколько из галереи телефона → они грузятся по очереди.
   У каждой карточки: подпись, «на головній», порядок стрелками, скрыть, удалить. */
export default function GalleryManager({ initial }: { initial: Item[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>(initial);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files);
    let done = 0;
    for (const file of list) {
      setProgress(`Завантажуємо ${done + 1} з ${list.length}…`);
      try {
        const { path } = await uploadImage(file, 'gallery');
        await adminFetch('/api/admin/gallery', { method: 'POST', body: JSON.stringify({ image_path: path }) });
        done++;
      } catch (e) {
        setError(`${file.name}: ${(e as Error).message}`);
      }
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = '';
    // свежий список с сервера: новые фото встают первыми, с правильным порядком.
    // Если всё упало — не перезагружаем, иначе текст ошибки пропадёт.
    if (done > 0) window.location.reload();
  }

  async function patch(id: string, data: Partial<GalleryRow>) {
    setError(null);
    const before = items;
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...data } : x)));
    try {
      await adminFetch('/api/admin/gallery', { method: 'PATCH', body: JSON.stringify({ id, ...data }) });
    } catch (e) {
      setItems(before);
      setError((e as Error).message);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    const before = items;
    setItems(next);
    try {
      await adminFetch('/api/admin/gallery', { method: 'PATCH', body: JSON.stringify({ order: next.map((x) => x.id) }) });
    } catch (e) {
      setItems(before);
      setError((e as Error).message);
    }
  }

  async function del(id: string) {
    setError(null);
    const before = items;
    setItems((xs) => xs.filter((x) => x.id !== id));
    try {
      await adminFetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      setItems(before);
      setError((e as Error).message);
    }
  }

  const homeIds = items.filter((x) => x.active && x.on_home).slice(0, 5).map((x) => x.id);

  return (
    <>
      <div className="admin-toolbar">
        <label className="btn" style={{ display: 'inline-grid', placeItems: 'center', cursor: 'pointer' }}>
          + Додати фото
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={Boolean(progress)}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {progress && <span className="t-small" role="status">{progress}</span>}
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      {items.length === 0 && !progress && (
        <div className="note">
          Поки порожньо — на сайті показуються тимчасові фото. Додайте перші роботи, і вони одразу
          їх замінять.
        </div>
      )}

      <div className="admin-grid">
        {items.map((it, i) => (
          <article key={it.id} className={`admin-card${it.active ? '' : ' is-hidden'}`}>
            <div className="admin-card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt="" loading="lazy" />
              {homeIds.includes(it.id) && <span className="admin-flag">На гірлянді</span>}
              {!it.active && <span className="admin-flag admin-flag--muted">Приховано</span>}
            </div>

            <input
              className="input admin-input"
              placeholder="Підпис (необов’язково)"
              defaultValue={it.caption ?? ''}
              maxLength={80}
              aria-label="Підпис до фото"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v !== (it.caption ?? '')) patch(it.id, { caption: v || null });
              }}
            />

            <label className="admin-check">
              <input
                type="checkbox"
                checked={it.on_home}
                onChange={(e) => patch(it.id, { on_home: e.target.checked })}
              />
              На головній
            </label>

            <div className="admin-row">
              <button type="button" className="admin-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Вище">↑</button>
              <button type="button" className="admin-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Нижче">↓</button>
              <button type="button" className="admin-link" onClick={() => patch(it.id, { active: !it.active })}>
                {it.active ? 'Сховати' : 'Показати'}
              </button>
              <DeleteButton onConfirm={() => del(it.id)} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
