/* ============================================================
   АНОНСИ ПОДІЙ

   Источник данных сейчас — опубликованная Google-таблица (CSV).
   Администратор редактирует строки, сайт подхватывает изменения
   без участия разработчика. Позже источник заменится на админку
   в CRM: снаружи ничего не изменится, поменяется только getAnnouncements().

   Как подключить таблицу:
   1) Колонки первой строкой (латиницей):
      id | title | cover | starts_at | ends_at | place | age | short | full | price | seats | link | active
        - starts_at / ends_at — «2026-09-20 13:00» (ends_at можно не заполнять,
          тогда событие живёт до конца дня starts_at)
        - price   — текст: «безкоштовно», «350 ₴», «від 50 ₴ донат»
        - seats   — число вільних місць; 0 = «місць немає»; порожньо = не показуємо
        - active  — TRUE/FALSE, ручное снятие с публикации до срока
   2) Файл → Опублікувати в Інтернеті → цей аркуш → CSV → Опублікувати.
   3) Ссылку положить в .env.local:
      ANNOUNCEMENTS_CSV_URL=https://docs.google.com/.../pub?output=csv

   Пока переменной нет, работают демо-данные ниже (реальные события студии).
   ============================================================ */

export interface Announcement {
  id: string;
  title: string;
  cover?: string;
  startsAt: string;      // ISO-подобная строка «2026-09-20 13:00»
  endsAt?: string;
  place?: string;
  age?: string;
  short: string;
  full?: string;
  price?: string;
  seats?: number | null;
  link?: string;
  active: boolean;
}

/* Реальные анонсы студии из Instagram — служат и демо-данными,
   и образцом того, как заполнять таблицу. */
const SEED: Announcement[] = [
  {
    id: 'open-doors-2026-09-20',
    title: 'День відкритих дверей',
    startsAt: '2026-09-20 13:00',
    place: 'Молодіжний, вул. Лесі Українки, 37А',
    age: 'для всієї родини',
    short: 'Приходьте разом із дитиною познайомитися зі студією, викладачами та атмосферою.',
    full:
      'На вас чекають: творчий майстер-клас із розпису гіпсових фігурок, безкоштовний аквагрим, ' +
      'аніматор-капібара, музика та святкова атмосфера, розіграш подарунків. ' +
      'Бонус для гостей: відмічайте TVORCHI у Stories разом із капібарою та отримуйте –10% на перший абонемент. ' +
      'Можна записатися заздалегідь або просто завітати.',
    price: 'вхід вільний · майстер-клас за донат від 50 ₴',
    seats: null,
    active: true,
  },
  {
    id: 'new-season-all-inclusive',
    title: 'Новий сезон: All Inclusive –50%',
    startsAt: '2026-09-03 00:00',
    endsAt: '2026-09-30 23:59',
    place: 'Раківка та Молодіжний',
    age: '3–8 років',
    short: 'Новим клієнтам — половина ціни на безлімітний абонемент: 2800 → 1400 ₴ на місяць.',
    full:
      'Дитина отримує доступ до всіх занять своєї вікової групи протягом місяця ' +
      'та безкоштовний Club Day. Перезапис уже відкрито, групи невеликі.',
    price: '1400 ₴ замість 2800 ₴',
    seats: null,
    active: true,
  },
  {
    id: 'moana-party-2026-09-13',
    title: 'MOANA 2 PARTY',
    startsAt: '2026-09-13 17:00',
    place: 'Раківка',
    age: '4–10 років',
    short: 'Тематична вечірка за мотивами улюбленого мультфільму: ігри, творчість і дискотека.',
    price: 'за записом',
    seats: 0,
    active: true,
  },
];

/* ---------- разбор CSV ---------- */

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (field.length || row.length) { row.push(field); rows.push(row); }
      field = ''; row = [];
      if (c === '\r' && next === '\n') i++;
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function rowsToAnnouncements(rows: string[][]): Announcement[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);

  return rows
    .slice(1)
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r, i) => {
      const get = (name: string) => {
        const j = idx(name);
        return j >= 0 ? (r[j] ?? '').trim() : '';
      };
      const seatsRaw = get('seats');
      const activeRaw = get('active');

      return {
        id: get('id') || `row-${i}`,
        title: get('title'),
        cover: get('cover') || undefined,
        startsAt: get('starts_at'),
        endsAt: get('ends_at') || undefined,
        place: get('place') || undefined,
        age: get('age') || undefined,
        short: get('short'),
        full: get('full') || undefined,
        price: get('price') || undefined,
        seats: seatsRaw === '' ? null : Number(seatsRaw),
        link: get('link') || undefined,
        active: activeRaw === '' ? true : /^(true|1|yes|так)$/i.test(activeRaw),
      };
    })
    .filter((a) => a.title && a.startsAt);
}

/* ---------- публичное API ---------- */

export async function getAnnouncements(): Promise<Announcement[]> {
  const url = process.env.ANNOUNCEMENTS_CSV_URL;
  if (!url) return SEED;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`CSV ${res.status}`);
    const items = rowsToAnnouncements(parseCSV(await res.text()));
    return items.length ? items : SEED;
  } catch {
    /* Таблица недоступна — сайт не должен падать из-за этого. */
    return SEED;
  }
}

function endMoment(a: Announcement): number {
  const raw = a.endsAt || `${a.startsAt.slice(0, 10)} 23:59`;
  const t = new Date(raw.replace(' ', 'T')).getTime();
  return Number.isNaN(t) ? Date.now() + 1 : t;
}

/* Прошедшие события уходят в архив сами — админу не нужно ничего снимать.

   Сортируем по дате окончания, а не начала: длинная акция, стартовавшая
   две недели назад, не должна оттеснять событие, которое уже послезавтра.
   Сверху всегда то, что сгорит раньше. */
export function upcoming(list: Announcement[], now: Date = new Date()): Announcement[] {
  return list
    .filter((a) => a.active && endMoment(a) >= now.getTime())
    .sort((a, b) => endMoment(a) - endMoment(b));
}

const MONTHS = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];

export function formatDate(value: string): string {
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  const time = value.includes(':') ? value.slice(11, 16) : '';
  const date = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return time && time !== '00:00' ? `${date}, ${time}` : date;
}
