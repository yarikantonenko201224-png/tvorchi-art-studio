import { adminGate, AdminNav } from '@/components/admin/AdminGate';
import { telegram, chatIds } from '@/lib/notify';
import TestButton, { ManualTest } from './TestButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Telegram — адмінка TVORCHI', robots: { index: false, follow: false } };

interface Chat { id: number; type: string; title?: string; first_name?: string; last_name?: string; username?: string }
interface Update { message?: { chat: Chat }; my_chat_member?: { chat: Chat }; channel_post?: { chat: Chat } }

/* Помощник подключения уведомлений: показывает, видит ли сайт бота,
   кто ему писал (их chat id) и позволяет отправить тестовое сообщение. */
export default async function AdminTelegramPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const gate = await adminGate((await searchParams).error);
  if (gate) return gate;

  const hasToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const me = hasToken ? await telegram<{ username: string; first_name: string }>('getMe') : null;
  const updates = hasToken ? await telegram<Update[]>('getUpdates', { limit: 100 }) : null;
  const chats = new Map<number, Chat>();
  for (const u of updates?.result ?? []) {
    const c = u.message?.chat ?? u.my_chat_member?.chat ?? u.channel_post?.chat;
    if (c) chats.set(c.id, c);
  }
  const configured = chatIds();

  return (
    <div className="page admin" style={{ paddingTop: 20 }}>
      <AdminNav active="tg" />
      <h1 className="t-h1">Telegram-сповіщення</h1>
      <p className="t-small" style={{ marginTop: 6, maxWidth: 640 }}>
        Кожна нова заявка з сайту миттєво приходить у Telegram. Тут видно, чи все підключено.
      </p>

      <div className="card" style={{ marginTop: 18 }}>
        <h2 className="t-h3">1. Бот</h2>
        {!hasToken && <p className="error">У .env.local не задано TELEGRAM_BOT_TOKEN.</p>}
        {me?.ok && me.result && (
          <p style={{ marginTop: 8 }}>
            ✅ Сайт бачить бота <a href={`https://t.me/${me.result.username}`} target="_blank" rel="noopener">@{me.result.username}</a>
          </p>
        )}
        {me && !me.ok && <p className="error">Telegram відхилив токен: {me.description}</p>}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2 className="t-h3">2. Хто написав боту</h2>
        <p className="t-small" style={{ marginTop: 6 }}>
          Щоб отримувати заявки, відкрийте бота в Telegram і натисніть «Start» (або додайте бота в групу студії й напишіть там будь-що).
          Потім оновіть цю сторінку: тут з’явиться ваш chat id.
        </p>
        {!hasToken ? (
          <p className="error" style={{ marginTop: 10 }}>Спершу додайте токен бота (крок 1), інакше сайт не бачить повідомлень.</p>
        ) : updates && !updates.ok ? (
          <p className="error" style={{ marginTop: 10 }}>
            Telegram не віддав повідомлення: {updates.description ?? 'немає відповіді'}.
            {updates.description?.includes('webhook') && ' У бота увімкнено webhook: його треба вимкнути (deleteWebhook).'}
          </p>
        ) : chats.size === 0 ? (
          <p style={{ marginTop: 10 }}>
            Поки ніхто не писав боту{me?.ok && me.result ? <> <b>@{me.result.username}</b></> : null}.
            Перевірте, що «Start» натиснули саме в цьому боті, і оновіть сторінку.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 10 }}>
            {[...chats.values()].map((c) => (
              <li key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <b>{c.title ?? [c.first_name, c.last_name].filter(Boolean).join(' ')}{c.username ? ` (@${c.username})` : ''}</b>
                <code style={{ padding: '3px 8px', background: '#F4EEE6', borderRadius: 8 }}>{c.id}</code>
                <span className="t-small">{c.type === 'private' ? 'особистий чат' : 'група'}</span>
                {configured.includes(String(c.id)) ? <span style={{ color: '#2E8B57', fontWeight: 700 }}>підключено ✓</span> : null}
                <TestButton chatId={String(c.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2 className="t-h3">Перевірити chat id вручну</h2>
        <p className="t-small" style={{ marginTop: 6 }}>Якщо знаєте chat id (наприклад, з @userinfobot), вставте його й надішліть тест.</p>
        <ManualTest />
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2 className="t-h3">3. Куди слати заявки</h2>
        {configured.length ? (
          <p style={{ marginTop: 8 }}>✅ Заявки йдуть у: {configured.map((id) => <code key={id} style={{ marginRight: 8 }}>{id}</code>)}</p>
        ) : (
          <p style={{ marginTop: 8 }}>
            Скопіюйте chat id зі списку вище в <code>.env.local</code> рядком <code>TELEGRAM_CHAT_ID=…</code> і перезапустіть сайт.
            Кілька отримувачів можна вказати через кому.
          </p>
        )}
      </div>
    </div>
  );
}
