import Link from 'next/link';
import { isAuthorized, isAdminConfigured } from '@/lib/admin-auth';
import { isSupabaseReady } from '@/lib/supabase';

/* Общий «вход» для всех страниц админки.
   Возвращает экран (не настроено / вход / нет базы) или null — тогда можно показывать раздел. */
export async function adminGate(error?: string): Promise<React.ReactElement | null> {
  if (!isAdminConfigured()) {
    return (
      <div className="page" style={{ paddingTop: 40 }}>
        <h1 className="t-h1">Адмінка не налаштована</h1>
        <p className="t-lead">
          Задайте змінну <code>ADMIN_PASSWORD</code> у налаштуваннях проєкту —
          після цього тут з’явиться вхід.
        </p>
      </div>
    );
  }

  if (!(await isAuthorized())) {
    return (
      <div className="page" style={{ paddingTop: 40, maxWidth: 420 }}>
        <h1 className="t-h1">Вхід</h1>
        <p className="t-lead">Панель адміністратора студії.</p>

        <form action="/admin/login" method="post" className="field">
          <label className="t-label" htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            autoComplete="current-password"
            autoFocus
          />
          {error && <p className="error">{error === 'locked' ? 'Забагато спроб. Спробуйте через 15 хвилин.' : 'Невірний пароль'}</p>}
          <button className="btn btn--wide" style={{ marginTop: 16 }} type="submit">
            Увійти
          </button>
        </form>
      </div>
    );
  }

  if (!isSupabaseReady()) {
    return (
      <div className="page" style={{ paddingTop: 40 }}>
        <h1 className="t-h1">База даних не підключена</h1>
        <p className="t-lead">
          Впишіть <code>SUPABASE_URL</code> і <code>SUPABASE_SERVICE_ROLE_KEY</code> у{' '}
          <code>.env.local</code> (на сервері — у Vercel) і перезапустіть сайт.
          Інструкція: <code>docs/SUPABASE.md</code>.
        </p>
      </div>
    );
  }

  return null;
}

const TABS = [
  { id: 'leads', href: '/admin', label: 'Заявки' },
  { id: 'gallery', href: '/admin/galereya', label: 'Галерея' },
  { id: 'events', href: '/admin/anonsy', label: 'Анонси' },
  { id: 'mk', href: '/admin/foto-mk', label: 'Фото МК' },
  { id: 'tg', href: '/admin/telegram', label: 'Telegram' },
] as const;

export function AdminNav({ active }: { active: (typeof TABS)[number]['id'] }) {
  return (
    <div className="admin-nav">
      <nav className="admin-tabs" aria-label="Розділи адмінки">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className={`admin-tab${t.id === active ? ' is-active' : ''}`}
            aria-current={t.id === active ? 'page' : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <form action="/admin/logout" method="post">
        <button type="submit" className="admin-logout">Вийти</button>
      </form>
    </div>
  );
}
