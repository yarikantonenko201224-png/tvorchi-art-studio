'use client';

import { useState } from 'react';
import { uploadImage, adminFetch } from '@/lib/resize-image';
import DeleteButton from '@/components/admin/DeleteButton';

interface Item {
  slug: string;
  title: string;
  uploaded: string | null;
  fallback: string | null;
}

export default function MkPhotosManager({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function replace(slug: string, file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(slug);
    try {
      const { path, url } = await uploadImage(file, 'mk');
      await adminFetch('/api/admin/mk-photos', { method: 'PUT', body: JSON.stringify({ slug, image_path: path }) });
      setItems((xs) => xs.map((x) => (x.slug === slug ? { ...x, uploaded: url } : x)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function clear(slug: string) {
    setError(null);
    setBusy(slug);
    try {
      await adminFetch(`/api/admin/mk-photos?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      setItems((xs) => xs.map((x) => (x.slug === slug ? { ...x, uploaded: null } : x)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="admin-grid">
        {items.map((it) => {
          const src = it.uploaded ?? it.fallback;
          return (
            <article key={it.slug} className="admin-card">
              <div className="admin-card-img">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" loading="lazy" />
                ) : (
                  <span className="admin-empty">Немає фото</span>
                )}
                {!it.uploaded && it.fallback && <span className="admin-flag admin-flag--muted">Тимчасове</span>}
                {busy === it.slug && <span className="admin-flag">Завантажуємо…</span>}
              </div>
              <div className="admin-card-title">{it.title}</div>
              <div className="admin-row">
                <label className="admin-link" style={{ cursor: 'pointer' }}>
                  {src ? 'Замінити фото' : 'Додати фото'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={busy !== null}
                    onChange={(e) => replace(it.slug, e.target.files?.[0])}
                  />
                </label>
                {it.uploaded && <DeleteButton label="Прибрати" onConfirm={() => clear(it.slug)} />}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
