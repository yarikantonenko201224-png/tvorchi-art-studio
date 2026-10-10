/* Большие события со своей страницей (табори, фестивали).
   Обычные анонсы студия ведёт в админке; здесь — то, что требует
   развёрнутой программы по дням. Афиши лежат в public/events/<slug>/. */

import type { Announcement } from './announcements';

export interface CampDay {
  n: number;
  date: string;      // «Пн, 26.10»
  title: string;
  poster: string;
  items: string[];
  note?: string;
}

export interface Camp {
  slug: string;
  title: string;
  subtitle: string;
  dates: string;
  startsAt: string;  // киевское время, для «скільки лишилось»
  endsAt: string;
  poster: string;
  highlights: string[];
  formats: { title: string; time: string }[];
  days: CampDay[];
  directKeyword: string;
}

export const AUTUMN_CAMP: Camp = {
  slug: 'osinniy-tabir',
  title: 'Осінній страшний табір у TVORCHI',
  subtitle: '5 днів пригод, творчості, експериментів та Halloween-настрою',
  dates: '26–30 жовтня',
  startsAt: '2026-10-26 08:00',
  endsAt: '2026-10-30 16:00',
  poster: '/events/tabir-osin/poster.jpg',
  highlights: [
    'Лазертаг',
    'Тематичні експерименти та квест',
    'Виїзна пригода до сироварні',
    'Halloween-творчість',
    'Кінодень',
    'Кулінарний майстер-клас',
    'Велика Halloween-вечірка',
    'Нагородження всіх учасників',
  ],
  formats: [
    { title: 'Повний день', time: '08:00–16:00' },
    { title: 'Пів дня', time: '08:00–12:00' },
  ],
  days: [
    {
      n: 1, date: 'Пн, 26.10', title: 'Стартуємо активно', poster: '/events/tabir-osin/day1.jpg',
      items: ['Граємо в лазертаг', 'Майстер-клас із розпису тематичних пряників', 'Знайомство, командні ігри та старт страшенно веселого тижня'],
    },
    {
      n: 2, date: 'Вт, 27.10', title: 'День страшних експериментів', poster: '/events/tabir-osin/day2.jpg',
      items: ['Великий тематичний квест у студії', 'Страшні та цікаві досліди', 'Майстер-клас зі створення власного слайму', 'Ігри та командні випробування'],
    },
    {
      n: 3, date: 'Ср, 28.10', title: 'День великої подорожі', poster: '/events/tabir-osin/day3.jpg',
      items: ['Виїзна екскурсія до сироварні в Кобеляках', 'Знайомимося з тим, як роблять сир', 'Контактний зоопарк', 'Куштуємо смаколики й спілкуємося з тваринками'],
      note: 'За умови набору групи',
    },
    {
      n: 4, date: 'Чт, 29.10', title: 'Готуємося до Halloween', poster: '/events/tabir-osin/day4.jpg',
      items: ['Ескізи майбутнього Halloween-гриму', 'Виготовляємо та декоруємо страшні маски', 'Розписуємо тематичні гіпсові фігурки', 'Кінодень із «Сімейкою Аддамс»'],
    },
    {
      n: 5, date: 'Пт, 30.10', title: 'Великий фінал Halloween', poster: '/events/tabir-osin/day5.jpg',
      items: ['Кулінарний майстер-клас у «Ванілін»', 'Велика Halloween-вечірка', 'Тематичний грим та образи', 'Конкурси, музика, танці та страшенно веселі завдання', 'Нагородження та дипломи всім учасникам'],
    },
  ],
  directKeyword: 'ТАБІР',
};

/** Табір ще не закінчився? (порівняння в київському часі) */
export function isCampActive(camp: Camp, nowKyivLocal: string): boolean {
  return nowKyivLocal <= camp.endsAt;
}

/* ---------- Halloween-вечірки під замовлення ---------- */

export interface PartyTheme {
  id: string;
  title: string;
  lead: string;
  items: string[];
  poster: string;
  tone: string; // цвет акцента карточки
}

export const PARTIES = {
  slug: 'halloween-vechirky',
  title: 'Halloween-вечірки разом із TVORCHI',
  subtitle: 'Тематичні програми для вашої компанії',
  until: '2026-11-02 00:00', // после Хеллоуина страница уже не рекламируется
  cover: '/events/vechirky/cover.jpg',
  directKeyword: '+',
  audiences: ['клас', 'компанія друзів', 'своя група', 'просто компанія дітей'],
  venues: ['У студії TVORCHI', 'На вашій локації'],
  addons: [
    { icon: '🎃', title: 'Halloween-аквагрим' },
    { icon: '🖌️', title: 'Тематичний майстер-клас' },
    { icon: '🪩', title: 'Дискотека' },
    { icon: '📸', title: 'Фотозона' },
    { icon: '🍭', title: 'Солодкий стіл' },
    { icon: '🍕', title: 'Піца та напої' },
    { icon: '🎁', title: 'Подарунки для гостей' },
  ],
  themes: [
    {
      id: 'frankenstein', title: 'Frankenstein Party', tone: '#7BC74D', poster: '/events/vechirky/frankenstein.jpg',
      lead: 'На один вечір студія перетворюється на лабораторію божевільного професора.',
      items: ['Секретні формули', 'Загадкові експерименти', 'Створення власного монстра', 'Командні випробування', '«Електричні» конкурси', 'Творча лабораторія Франкенштейна'],
    },
    {
      id: 'monster', title: 'Monster Party', tone: '#B07CFF', poster: '/events/vechirky/monster.jpg',
      lead: 'Тут страшні монстри зовсім не страшні. Навпаки, вони влаштовують найгучнішу вечірку року!',
      items: ['Монстр-імена та образи', '«Школа монстрів»', 'Веселі конкурси', 'Monster Dance Battle', 'Власний маленький монстрик на майстер-класі'],
    },
    {
      id: 'garbuzova', title: 'Таємниця Гарбузової вулиці', tone: '#F28C38', poster: '/events/vechirky/garbuzova.jpg',
      lead: 'Містична пригода для маленьких детективів: за картою Гарбузової вулиці шукаємо, куди зник головний символ Halloween.',
      items: ['Пошук підказок', 'Таємні послання та загадки', 'Випробування на уважність', 'Власний Halloween-амулет', 'Фінальний пошук скарбу'],
    },
    {
      id: 'dyvni-spravy', title: 'Дуже дивні справи', tone: '#FF4D4D', poster: '/events/vechirky/dyvni-spravy.jpg',
      lead: 'У нашому місті відкрилося щось… дуже дивне. У команди лише 90 хвилин, щоб закрити портал в інший світ.',
      items: ['Командний квест', 'Карта та підказки', 'Таємний алфавіт', 'Пошук артефактів', 'Містична фотозона', 'Фінальна місія'],
    },
    {
      id: 'tsyrk', title: 'Цифровий цирк', tone: '#3FA9F5', poster: '/events/vechirky/tsyrk.jpg',
      lead: 'Яскрава вечірка, де все трохи дивне, непередбачуване й дуже веселе.',
      items: ['Власні персонажі', 'Дивакуваті випробування', 'Шифри та челенджі', 'Арт у стилі цифрового цирку', 'Пошук виходу з гри'],
    },
    {
      id: 'wednesday', title: 'Wednesday Party', tone: '#C9C2D6', poster: '/events/vechirky/wednesday.jpg',
      lead: 'Для тих, хто любить чорний колір, загадки та трохи похмурого гумору. Академія Nevermore відкриває набір!',
      items: ['Вступні випробування', 'Таємне послання', 'Вчимося передбачати майбутнє', 'Пошук загадкової Речі', 'Легендарний танець Wednesday', 'Стильний gothic-сувенір'],
    },
  ] as PartyTheme[],
};

/* ---------- Одноденна поїздка ---------- */

export const AUTUMN_TRIP = {
  slug: 'osinnia-podorozh',
  title: 'Осіння пригода',
  subtitle: 'Сорочин Яр × Ковалівка: одноденна поїздка з TVORCHI',
  date: '17 жовтня',
  dayShort: 'Сб, 17.10',
  startsAt: '2026-10-17 08:00',
  endsAt: '2026-10-17 19:00',
  poster: '/events/podorozh-osin/poster.jpg',
  departISO: '2026-10-17T08:00:00+03:00',
  depart: '08:00',
  back: '18:30–19:00',
  directKeyword: 'ГАРБУЗ',
  tags: ['Гарбуз-парк', 'Тваринки', 'Осінні локації', 'Фотозони', 'Природа', 'Розваги'],
  stops: [
    {
      title: 'Екопарк Ковалівка',
      icon: '🐐',
      items: ['Прогулянка парком', 'Знайомство з тваринами', 'Свято осені'],
    },
    {
      title: 'Гарбуз-парк у Сорочиному Яру',
      icon: '🎃',
      items: ['Осінні локації та фото', 'Ігри та розваги', 'Час для смаколиків і сувенірів'],
    },
  ],
};

/* ---------- Спецпроєкти как обычные анонсы ----------
   Чтобы табір и поездка сами появлялись в «Що буде найближчим часом» и на /anonsy,
   даже если студия не завела их в админке. Если в админке уже есть такой анонс
   (по ссылке или по слову в названии в те же даты) — не дублируем, а ведём его
   на страницу с программой. */

interface Special {
  href: string;
  match: RegExp;
  startsAt: string;
  endsAt: string;
  item: Announcement;
}

const SPECIALS: Special[] = [
  {
    href: `/anonsy/${AUTUMN_CAMP.slug}`,
    match: /таб[іо]р/i,
    startsAt: AUTUMN_CAMP.startsAt,
    endsAt: AUTUMN_CAMP.endsAt,
    item: {
      id: `camp-${AUTUMN_CAMP.slug}`,
      title: AUTUMN_CAMP.title,
      cover: AUTUMN_CAMP.poster,
      startsAt: AUTUMN_CAMP.startsAt,
      endsAt: AUTUMN_CAMP.endsAt,
      age: 'для дітей',
      short: AUTUMN_CAMP.subtitle,
      price: AUTUMN_CAMP.formats.map((f) => `${f.title.toLowerCase()} ${f.time}`).join(' або '),
      link: `/anonsy/${AUTUMN_CAMP.slug}`,
      active: true,
    },
  },
  {
    href: `/anonsy/${AUTUMN_TRIP.slug}`,
    match: /пригод|подорож|поїздк|гарбуз/i,
    startsAt: AUTUMN_TRIP.startsAt,
    endsAt: AUTUMN_TRIP.endsAt,
    item: {
      id: `trip-${AUTUMN_TRIP.slug}`,
      title: `${AUTUMN_TRIP.title}: Сорочин Яр × Ковалівка`,
      cover: AUTUMN_TRIP.poster,
      startsAt: AUTUMN_TRIP.startsAt,
      endsAt: AUTUMN_TRIP.endsAt,
      place: 'Виїзд із Кременчука',
      short: 'Гарбуз-парк, тваринки, осінні локації та розваги на цілий день.',
      price: `виїзд ${AUTUMN_TRIP.depart}, повернення ${AUTUMN_TRIP.back}`,
      link: `/anonsy/${AUTUMN_TRIP.slug}`,
      active: true,
    },
  },
];

export function withEvents(list: Announcement[], nowKyiv: string): Announcement[] {
  let out = list;
  const day = (v: string) => v.slice(0, 10);
  for (const sp of SPECIALS) {
    if (nowKyiv > sp.endsAt) continue;
    const same = (a: Announcement) =>
      !!a.link?.includes(sp.href) ||
      (sp.match.test(a.title) && day(a.startsAt) >= day(sp.startsAt) && day(a.startsAt) <= day(sp.endsAt));
    if (out.some(same)) out = out.map((a) => (same(a) && !a.link ? { ...a, link: sp.href } : a));
    else out = [sp.item, ...out];
  }
  return out;
}

/** Что сейчас крутить в сезонной ленте и на главной — по порядку дат. */
export function activePromos(nowKyiv: string) {
  const list: { href: string; title: string; when: string; endsAt: string }[] = [];
  if (nowKyiv <= AUTUMN_TRIP.endsAt)
    list.push({ href: `/anonsy/${AUTUMN_TRIP.slug}`, title: 'Осіння пригода: Гарбуз-парк і Ковалівка', when: AUTUMN_TRIP.date, endsAt: AUTUMN_TRIP.endsAt });
  if (nowKyiv <= AUTUMN_CAMP.endsAt)
    list.push({ href: `/anonsy/${AUTUMN_CAMP.slug}`, title: 'Осінній страшний табір', when: AUTUMN_CAMP.dates, endsAt: AUTUMN_CAMP.endsAt });
  if (nowKyiv <= PARTIES.until)
    list.push({ href: `/anonsy/${PARTIES.slug}`, title: 'Halloween-вечірки для вашої компанії', when: 'на вашу дату', endsAt: PARTIES.until });
  return list;
}
