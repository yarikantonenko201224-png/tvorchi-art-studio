/* Уведомление администратора о новой заявке в Telegram.

   Включается двумя переменными окружения:
     TELEGRAM_BOT_TOKEN — токен бота от @BotFather
     TELEGRAM_CHAT_ID   — куда слать: личный чат или группа студии
   Пока их нет, функция молча ничего не делает — сайт работает как раньше.

   Никогда не бросает исключение: сбой Telegram не должен ломать приём заявки.
   Заявка к этому моменту уже сохранена в базе. */

import type { LeadInput } from './leads';

const SOURCE_TITLE: Record<LeadInput['source'], string> = {
  trial: '🎨 Пробне заняття',
  masterclass: '🖌 Майстер-клас',
  birthday: '🎂 День народження',
  certificate: '🎁 Сертифікат',
  quiz: '🧩 Підбір заняття',
  camp: '🎃 Табір',
  party: '🦇 Halloween-вечірка',
  trip: '🍂 Поїздка',
};

function esc(value: unknown): string {
  return String(value).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
}

/** Человекочитаемые подписи для полей payload. Неизвестные ключи не выводим. */
const PAYLOAD_LABELS: Record<string, string> = {
  day: 'День', time: 'Час', place: 'Локація', ageGroup: 'Група',
  audience: 'Для кого', wish: 'Побажання',
  age: 'Вік', package: 'Пакет', duration: 'Тривалість', theme: 'Тематика', date: 'Дата',
  recipient: 'Кому', kind: 'Що', lesson: 'Заняття', masterclass: 'МК', format: 'Формат',
  toName: 'Отримувач', fromName: 'Від кого', comment: 'Коментар',
  camp: 'Табір', campFormat: 'Формат',
  event: 'Подія', venue: 'Де', addons: 'Додати', seats: 'Місць', kids: 'Дітей',
};

export function formatLeadMessage(lead: LeadInput): string {
  const lines: string[] = [`<b>${SOURCE_TITLE[lead.source]}</b>`, ''];

  if (lead.direction) lines.push(`📌 ${esc(lead.direction)}`);
  if (lead.parentName) lines.push(`👤 ${esc(lead.parentName)}`);
  if (lead.childName) {
    lines.push(`🧒 ${esc(lead.childName)}${lead.childAge ? `, ${lead.childAge} р.` : ''}`);
  }
  lines.push(`📞 <a href="tel:${esc(lead.phone)}">${esc(lead.phone)}</a>`);
  if (lead.email) lines.push(`✉️ ${esc(lead.email)}`);
  if (lead.people) lines.push(`👥 ${lead.people}`);
  if (lead.amount) lines.push(`💰 ${lead.amount.toLocaleString('uk-UA')} ₴`);

  const extra = Object.entries(lead.payload ?? {})
    .filter(([k, v]) => PAYLOAD_LABELS[k] && v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${PAYLOAD_LABELS[k]}: ${esc(v)}`);
  if (extra.length) lines.push('', ...extra);

  return lines.join('\n');
}

/** Вызов Telegram Bot API. Токен берём только из окружения сервера. */
export async function telegram<T = unknown>(method: string, body?: Record<string, unknown>): Promise<{ ok: boolean; result?: T; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: 'TELEGRAM_BOT_TOKEN не задано' };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    return { ok: false, description: String(error) };
  }
}

/** Получатели: один или несколько chat_id через запятую (владелица, группа студии…). */
export function chatIds(): string[] {
  return (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

export async function notifyNewLead(lead: LeadInput): Promise<void> {
  const ids = chatIds();
  if (!process.env.TELEGRAM_BOT_TOKEN || !ids.length) return;
  const text = formatLeadMessage(lead);
  await Promise.all(
    ids.map(async (chat_id) => {
      const r = await telegram('sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true });
      if (!r.ok) console.error('[notify] Telegram:', chat_id, r.description);
    }),
  );
}
