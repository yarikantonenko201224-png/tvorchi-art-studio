/* Сезонное оформление сайта.

   Хеллоуин включается сам: с 1 октября по 1 ноября включительно (по Киеву).
   Ручное управление — переменная окружения SITE_SEASON:
     SITE_SEASON=halloween  — включить сейчас (например, для проверки)
     SITE_SEASON=off        — выключить, даже если сейчас октябрь
   Всё сезонное — только украшения: если выключить, сайт остаётся целым. */

export type Season = 'halloween' | null;

export function currentSeason(now: Date = new Date()): Season {
  const forced = process.env.SITE_SEASON;
  if (forced === 'off') return null;
  if (forced === 'halloween') return 'halloween';

  const kyiv = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv', month: '2-digit', day: '2-digit' })
    .format(now); // «10-10»
  const [m, d] = kyiv.split('-').map(Number);
  if (m === 10 || (m === 11 && d <= 1)) return 'halloween';
  return null;
}
