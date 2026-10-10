import { NextResponse } from 'next/server';
import { guard, bad } from '@/lib/admin-api';
import { telegram } from '@/lib/notify';

/* Тестовое сообщение из админки: проверить, что бот пишет в нужный чат. */
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const chatId = String(body.chatId ?? '').trim();
  if (!/^-?\d{3,20}$/.test(chatId)) return bad('Невірний chat id');
  const r = await telegram('sendMessage', {
    chat_id: chatId,
    text: '✅ <b>TVORCHI</b>\nСповіщення про заявки з сайту підключено. Нові заявки приходитимуть сюди.',
    parse_mode: 'HTML',
  });
  if (!r.ok) return NextResponse.json({ error: r.description ?? 'Telegram не відповів' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
