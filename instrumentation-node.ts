/* Сетевые запросы сервера (Supabase, Telegram) на некоторых Windows-машинах
   и хостингах подвисают на 15–20 секунд: Node.js сначала пробует IPv6,
   ждёт таймаута и только потом идёт по IPv4. В браузере того же компьютера
   те же адреса открываются за десятки миллисекунд.
   Лечится двумя настройками: сначала IPv4, и параллельная попытка обоих
   протоколов (happy eyeballs) — что ответит раньше, то и используем. */
import dns from 'dns';
import net from 'net';

dns.setDefaultResultOrder('ipv4first');

if (typeof net.setDefaultAutoSelectFamily === 'function') {
  net.setDefaultAutoSelectFamily(true);
}
