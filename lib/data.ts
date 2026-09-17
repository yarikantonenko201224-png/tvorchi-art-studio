/* ============================================================
   Данные студии. Пока статические — источник: Google-таблица
   расписания владелицы (17.09.2026) и прайсы из Instagram.
   Позже этот модуль заменяется запросами к Supabase, интерфейсы
   остаются теми же, поэтому компоненты трогать не придётся.
   ============================================================ */

export type AgeId = '3-4' | '5-6' | '7-8' | '9+';
export type Tier = 'std' | 'rob' | 'tut';
export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface Lesson {
  id: string;
  age: AgeId;
  dir: string;
  day: DayId;
  time: string;
  dur: number;
  place: string;
  tier: Tier;
}

export interface AgeGroup {
  id: AgeId;
  title: string;
  note: string;
  years: number[];
}

export interface PriceTier {
  single: number;
  pack4: number;
  pack8: number;
  pack12: number;
}

export const STUDIO = {
  name: 'TVORCHI ART STUDIO',
  phone: '+380 96 336 07 38',
  phoneHref: 'tel:+380963360738',
  instagram: 'https://www.instagram.com/tvorchi_artstudio_/',
  viber: 'viber://chat?number=%2B380963360738',
  city: 'Кременчук',
  locations: [
    { slug: 'rakivka', title: 'Раківка', address: '' },
    { slug: 'molodizhny', title: 'Молодіжний', address: 'вул. Лесі Українки, 37А' },
  ],
} as const;

export const DAY_SHORT: Record<DayId, string> = {
  mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб',
};

export const DAY_FULL: Record<DayId, string> = {
  mon: 'понеділок', tue: 'вівторок', wed: 'середа',
  thu: 'четвер', fri: 'п’ятниця', sat: 'субота',
};

export const AGE_GROUPS: AgeGroup[] = [
  { id: '3-4', title: '3–4', note: 'Ранній розвиток, сенсорика, ліплення, малювання', years: [3, 4] },
  { id: '5-6', title: '5–6', note: 'Підготовка до школи, малювання, робототехніка', years: [5, 6] },
  { id: '7-8', title: '7–8', note: 'Малювання, англійська, робототехніка', years: [7, 8] },
  { id: '9+',  title: '9+',  note: 'Малювання для старших, репетиторство', years: [9, 10, 11, 12, 13] },
];

/* Цены: разове / 4 / 8 / 12 занять. Материалы входят в стоимость. */
export const PRICES: Record<Tier, PriceTier> = {
  std: { single: 250, pack4: 900,  pack8: 1600, pack12: 2250 },
  rob: { single: 350, pack4: 1200, pack8: 2200, pack12: 3150 },
  tut: { single: 250, pack4: 1000, pack8: 1700, pack12: 2300 },
};

/* Пробное занятие — отдельная цена, ниже разового.
   Это вход в воронку, поэтому фигурирует на всех кнопках записи. */
export const TRIAL_PRICE = 150;

/* Ориентир по наполняемости: до 8 детей в группе.

   ВАЖНО: это НЕ жёсткий лимит для сайта. Владелица прямо просила не блокировать
   запись при достижении восьми — «за гроші вмістяться усі». Поэтому публичная
   часть не показывает счётчик свободных мест и никогда не отказывает в записи.
   Число используется как преимущество («невеликі групи до 8 дітей») и позже —
   внутри CRM, чтобы администратор видел, когда пора відкривати другу групу. */
export const GROUP_SIZE_MAX = 8;

export const ALL_INCLUSIVE = {
  price: 2800,
  promoPrice: 1400,
  title: 'ALL INCLUSIVE',
  description: 'Усі заняття своєї вікової групи протягом місяця та Club Day безкоштовно',
} as const;

/* Раківка — возрасты указаны в таблице явно */
export const LESSONS: Lesson[] = [
  { id: 'r01', age: '3-4', dir: 'Ранній розвиток',     day: 'mon', time: '16:30', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r02', age: '3-4', dir: 'Ліплення',            day: 'mon', time: '17:15', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r03', age: '5-6', dir: 'Підготовка до школи', day: 'mon', time: '18:00', dur: 60, place: 'Раківка', tier: 'std' },

  { id: 'r04', age: '7-8', dir: 'Малювання',           day: 'tue', time: '16:30', dur: 60, place: 'Раківка', tier: 'std' },
  { id: 'r05', age: '7-8', dir: 'Англійська мова',     day: 'tue', time: '17:30', dur: 60, place: 'Раківка', tier: 'std' },
  { id: 'r06', age: '9+',  dir: 'Репетиторство',       day: 'tue', time: '18:30', dur: 60, place: 'Раківка', tier: 'tut' },
  { id: 'r07', age: '9+',  dir: 'Репетиторство',       day: 'tue', time: '19:30', dur: 60, place: 'Раківка', tier: 'tut' },

  { id: 'r08', age: '3-4', dir: 'Ранній розвиток',     day: 'wed', time: '16:30', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r09', age: '3-4', dir: 'Сенсорика',           day: 'wed', time: '17:15', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r10', age: '5-6', dir: 'Підготовка до школи', day: 'wed', time: '18:00', dur: 60, place: 'Раківка', tier: 'std' },

  { id: 'r11', age: '7-8', dir: 'Робототехніка',       day: 'thu', time: '16:00', dur: 60, place: 'Раківка', tier: 'rob' },
  { id: 'r12', age: '7-8', dir: 'Англійська мова',     day: 'thu', time: '17:00', dur: 60, place: 'Раківка', tier: 'std' },
  { id: 'r13', age: '9+',  dir: 'Репетиторство',       day: 'thu', time: '18:00', dur: 60, place: 'Раківка', tier: 'tut' },
  { id: 'r14', age: '9+',  dir: 'Малювання',           day: 'thu', time: '19:00', dur: 60, place: 'Раківка', tier: 'std' },

  { id: 'r15', age: '3-4', dir: 'Ліплення',            day: 'fri', time: '16:00', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r16', age: '5-6', dir: 'Малювання',           day: 'fri', time: '17:00', dur: 60, place: 'Раківка', tier: 'std' },
  { id: 'r17', age: '5-6', dir: 'Робототехніка',       day: 'fri', time: '18:00', dur: 60, place: 'Раківка', tier: 'rob' },

  { id: 'r18', age: '3-4', dir: 'Малювання',           day: 'sat', time: '11:00', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r19', age: '3-4', dir: 'Сенсорика',           day: 'sat', time: '11:45', dur: 45, place: 'Раківка', tier: 'std' },
  { id: 'r20', age: '3-4', dir: 'Ранній розвиток',     day: 'sat', time: '12:30', dur: 45, place: 'Раківка', tier: 'std' },
];

/* Молодіжний — в таблице вместо возраста «Старша / Молодша».
   Соответствие возрастным группам ещё уточняется у владелицы,
   поэтому эти занятия показываем в расписании, но не в подборе по возрасту. */
export interface MolodizhnyLesson {
  id: string;
  dir: string;
  day: DayId;
  time: string;
  group: string | null;
  tier: Tier;
}

export const MOLODIZHNY: MolodizhnyLesson[] = [
  { id: 'm01', dir: 'Англійська мова',      day: 'mon', time: '17:00', group: 'Старша',  tier: 'std' },
  { id: 'm02', dir: 'Англійська мова',      day: 'mon', time: '18:00', group: 'Молодша', tier: 'std' },
  { id: 'm03', dir: 'Малювання',            day: 'wed', time: '17:00', group: 'Старша',  tier: 'std' },
  { id: 'm04', dir: 'Малювання / Ліплення', day: 'wed', time: '18:00', group: 'Молодша', tier: 'std' },
  { id: 'm05', dir: 'Робототехніка',        day: 'fri', time: '17:00', group: null,      tier: 'rob' },
  { id: 'm06', dir: 'Підготовка до школи',  day: 'fri', time: '18:00', group: null,      tier: 'std' },
];

/* Анонсы живут в lib/announcements.ts — у них своя модель
   и свой источник (таблица администратора). */

/* ============================================================
   ТЕГИ НАПРЯМКІВ — для подбора занятия по трём вопросам.

   Ключ — название направления ровно как в расписании.
   Доступность считается из LESSONS: квиз рекомендует только то,
   на что реально можно записаться в этом возрасте. Иначе подбор
   пообещает X-LAB, которого нет ни в одной группе.

   Матрицу проставили мы, владелица корректирует после теста —
   это её педагогическая территория.
   ============================================================ */

export type LikeTag = 'malyuvaty' | 'ruky' | 'tehnika' | 'spilkuvatys' | 'zadachi';
export type DevelopTag = 'tvorchist' | 'komunikatsiya' | 'logika' | 'samostiynist' | 'vpevnenist';

export const LIKE_LABELS: Record<LikeTag, string> = {
  malyuvaty: 'Малювати',
  ruky: 'Створювати руками',
  tehnika: 'Техніка',
  spilkuvatys: 'Спілкуватися',
  zadachi: 'Розв’язувати задачі',
};

export const DEVELOP_LABELS: Record<DevelopTag, string> = {
  tvorchist: 'Творчість',
  komunikatsiya: 'Комунікацію',
  logika: 'Логіку',
  samostiynist: 'Самостійність',
  vpevnenist: 'Впевненість',
};

/* Родительный падеж для фразы «бо дитина любить …» */
export const LIKE_PHRASES: Record<LikeTag, string> = {
  malyuvaty: 'малювати',
  ruky: 'створювати руками',
  tehnika: 'техніку',
  spilkuvatys: 'спілкуватися',
  zadachi: 'розв’язувати задачі',
};

export const DEVELOP_PHRASES: Record<DevelopTag, string> = {
  tvorchist: 'творчість',
  komunikatsiya: 'комунікацію',
  logika: 'логіку',
  samostiynist: 'самостійність',
  vpevnenist: 'впевненість',
};

export interface DirectionTags {
  likes: LikeTag[];
  develops: DevelopTag[];
}

export const DIRECTION_TAGS: Record<string, DirectionTags> = {
  'Малювання':            { likes: ['malyuvaty', 'ruky'],      develops: ['tvorchist', 'vpevnenist'] },
  'Ліплення':             { likes: ['ruky'],                   develops: ['tvorchist', 'samostiynist'] },
  'Сенсорика':            { likes: ['ruky'],                   develops: ['samostiynist', 'vpevnenist'] },
  'Ранній розвиток':      { likes: ['spilkuvatys', 'ruky'],    develops: ['samostiynist', 'komunikatsiya'] },
  'Підготовка до школи':  { likes: ['zadachi'],                develops: ['logika', 'samostiynist'] },
  'Робототехніка':        { likes: ['tehnika', 'zadachi'],     develops: ['logika', 'samostiynist'] },
  'X-LAB':                { likes: ['tehnika', 'zadachi'],     develops: ['logika', 'vpevnenist'] },
  'Англійська мова':      { likes: ['spilkuvatys'],            develops: ['komunikatsiya', 'vpevnenist'] },
  'Репетиторство':        { likes: ['zadachi'],                develops: ['logika', 'vpevnenist'] },
};

export interface QuizMatch {
  dir: string;
  score: number;
  matchedLikes: LikeTag[];
  matchedDevelops: DevelopTag[];
  lessons: Lesson[];
}

/* Возраст — жёсткий фильтр, остальное набирает очки.
   По два очка за совпадение интереса и за совпадение цели: и то и другое
   одинаково важно, иначе выдача кренится в одну сторону. */
export function matchDirections(
  age: AgeId,
  likes: LikeTag[],
  develops: DevelopTag[],
): QuizMatch[] {
  const available = lessonsByAge(age);
  const names = Array.from(new Set(available.map((l) => l.dir)));

  return names
    .map((dir) => {
      const tags = DIRECTION_TAGS[dir] ?? { likes: [], develops: [] };
      const matchedLikes = tags.likes.filter((t) => likes.includes(t));
      const matchedDevelops = tags.develops.filter((t) => develops.includes(t));
      return {
        dir,
        score: matchedLikes.length * 2 + matchedDevelops.length * 2,
        matchedLikes,
        matchedDevelops,
        lessons: available.filter((l) => l.dir === dir),
      };
    })
    .sort((a, b) => b.score - a.score);
}

/* ============================================================
   КЛАСТЕРИ — четыре смысловых направления для первого экрана.
   Родитель редко ищет «ліплення»; он ищет «щось творче для дитини».
   ============================================================ */

export interface Cluster {
  id: string;
  title: string;
  color: string;
  ages: string;
  directions: string[];
  priceFrom: number;
}

export const CLUSTERS: Cluster[] = [
  {
    id: 'creativity', title: 'Творчість', color: '#F26F21', ages: '3–8 років',
    directions: ['Малювання', 'Ліплення'], priceFrom: 250,
  },
  {
    id: 'tech', title: 'Технології', color: '#45C8C8', ages: '5–8 років',
    directions: ['Робототехніка', 'X-LAB'], priceFrom: 350,
  },
  {
    id: 'development', title: 'Розвиток', color: '#FBD668', ages: '3–6 років',
    directions: ['Ранній розвиток', 'Сенсорика', 'Підготовка до школи'], priceFrom: 250,
  },
  {
    id: 'communication', title: 'Комунікація', color: '#F73FA6', ages: '7+ років',
    directions: ['Англійська мова', 'Репетиторство'], priceFrom: 250,
  },
];

/* ============================================================
   ДНІ НАРОДЖЕННЯ
   Возрастные группы праздников (4–5 / 6–8 / 9–12) НЕ совпадают
   с возрастными группами занятий (3–4 / 5–6 / 7–8) — это разные услуги.
   ============================================================ */

export type BirthdayAgeId = '4-5' | '6-8' | '9-12';
export type PackageTier = 'mini' | 'standard' | 'premium';

export interface BirthdayPackage {
  age: BirthdayAgeId;
  tier: PackageTier;
  title: string;
  durationLabel: string;
  price: number;
  includes: string[];
}

export const BIRTHDAY_AGES: { id: BirthdayAgeId; title: string }[] = [
  { id: '4-5', title: '4–5 років' },
  { id: '6-8', title: '6–8 років' },
  { id: '9-12', title: '9–12 років' },
];

export const BIRTHDAY_CAPACITY = 15;

const BASE_MINI_4_5 = ['квест', 'перекус', 'подарунок', 'тематика на вибір'];
const BASE_MINI_OLDER = ['квест', 'майстер клас', 'перекус', 'подарунок', 'тематика на вибір'];
const STANDARD_EXTRA = ['фото зона', 'фото свята', 'дискотека', 'паперове шоу'];
const PREMIUM_EXTRA = [
  'сюрприз для гостей', 'аніматор', 'фото + відео свята',
  'дискотека', 'паперове шоу', 'мильне шоу', "пін'ята",
];

export const BIRTHDAY_PACKAGES: BirthdayPackage[] = [
  { age: '4-5', tier: 'mini', title: 'МІНІ', durationLabel: '1 година 15 хвилин', price: 2000,
    includes: BASE_MINI_4_5 },
  { age: '4-5', tier: 'standard', title: 'СТАНДАРТ', durationLabel: '1 година 45 хвилин', price: 4000,
    includes: [...BASE_MINI_4_5, ...STANDARD_EXTRA] },
  { age: '4-5', tier: 'premium', title: 'ПРЕМІУМ', durationLabel: '2 години 30 хвилин', price: 8000,
    includes: [...BASE_MINI_4_5, ...PREMIUM_EXTRA, 'фото зона'] },

  { age: '6-8', tier: 'mini', title: 'МІНІ', durationLabel: '1 година 15 хвилин', price: 2000,
    includes: BASE_MINI_OLDER },
  { age: '6-8', tier: 'standard', title: 'СТАНДАРТ', durationLabel: '1 година 45 хвилин', price: 4000,
    includes: [...BASE_MINI_OLDER, ...STANDARD_EXTRA] },
  { age: '6-8', tier: 'premium', title: 'ПРЕМІУМ', durationLabel: '2 години 30 хвилин', price: 8000,
    includes: [...BASE_MINI_OLDER, ...PREMIUM_EXTRA, 'фото зона'] },

  { age: '9-12', tier: 'mini', title: 'МІНІ', durationLabel: '1 година 15 хвилин', price: 2000,
    includes: BASE_MINI_OLDER },
  { age: '9-12', tier: 'standard', title: 'СТАНДАРТ', durationLabel: '1 година 45 хвилин', price: 4000,
    includes: [...BASE_MINI_OLDER, ...STANDARD_EXTRA] },
  { age: '9-12', tier: 'premium', title: 'ПРЕМІУМ', durationLabel: '2 години 30 хвилин', price: 8000,
    includes: [...BASE_MINI_OLDER, ...PREMIUM_EXTRA, 'фото зона'] },
];

export const BIRTHDAY_THEMES: Record<BirthdayAgeId, string[]> = {
  '4-5': ['Пінк: єдинороги, принцеси', 'Поні', 'Майнкрафт', 'Молнія Макквін', 'Щенячий патруль'],
  '6-8': ['Венсдей', 'Роблокс', 'TikTok', 'Лабубу', 'Стіч Пату', 'Майнкрафт', 'Лего Ніндзяго: Місія', 'Барбі'],
  '9-12': ['Роблокс', 'Гаррі Поттер', 'Венсдей', 'Гра в кальмара', 'TikTok', 'Скібіді (мем-вечірка)'],
};

export function packagesByAge(age: BirthdayAgeId): BirthdayPackage[] {
  return BIRTHDAY_PACKAGES.filter((p) => p.age === age);
}

/* Что добавляется на следующем уровне пакета — показываем разницу,
   а не одинаковые списки трёх карточек подряд. */
export function packageDiff(age: BirthdayAgeId, tier: PackageTier): string[] {
  const list = packagesByAge(age);
  const order: PackageTier[] = ['mini', 'standard', 'premium'];
  const idx = order.indexOf(tier);
  if (idx <= 0) return [];
  const prev = list.find((p) => p.tier === order[idx - 1]);
  const curr = list.find((p) => p.tier === tier);
  if (!prev || !curr) return [];
  return curr.includes.filter((i) => !prev.includes.includes(i));
}

/* ============================================================
   МАЙСТЕР-КЛАСИ
   Два прайса — детский и взрослый. Большинство позиций общие,
   поэтому на сайте это переключатель, а не два раздела.
   ============================================================ */

export interface MasterClass {
  slug: string;
  title: string;
  kids: { price: number; from?: boolean } | null;
  adults: { price: number; from?: boolean } | null;
}

export const MASTER_CLASSES: MasterClass[] = [
  { slug: 'liplennya-plastylin', title: 'Ліплення з пластиліну', kids: { price: 150 }, adults: { price: 150 } },
  /* «Пластилін» убран: владелица подтвердила, что это та же услуга,
     что и «Ліплення з пластиліну». В прайсах она дублировалась. */
  { slug: 'brelky', title: 'Створення брелків', kids: { price: 150, from: true }, adults: { price: 150, from: true } },
  { slug: 'glyna', title: 'Глина', kids: { price: 250 }, adults: { price: 250 } },
  { slug: 'malyuvannya-smoloyu', title: 'Малювання смолою', kids: { price: 300, from: true }, adults: { price: 300, from: true } },
  { slug: 'rozpys-pryanykiv', title: 'Розпис пряників / капкейків', kids: { price: 300, from: true }, adults: { price: 300 } },
  { slug: 'braslety', title: 'Робимо браслети', kids: { price: 320 }, adults: { price: 320 } },
  { slug: 'malyuvannya-dwp', title: 'Малювання на холсті (DWP)', kids: { price: 350 }, adults: { price: 350 } },
  { slug: 'rozmalovka-shopera', title: 'Розмальовка шоперів', kids: { price: 350 }, adults: { price: 350 } },
  { slug: 'rozmalovka-kepky', title: 'Розмальовка кепки', kids: { price: 350 }, adults: { price: 350 } },
  { slug: 'rozmalovka-tarilky', title: 'Розмальовка тарілки', kids: { price: 350 }, adults: { price: 350 } },
  { slug: 'malyuvannya-na-skli', title: 'Малювання на склі', kids: { price: 450 }, adults: { price: 450 } },
  { slug: 'holst-pidramnyk', title: 'Холст на підрамнику', kids: { price: 550 }, adults: { price: 550 } },
  { slug: 'rozmalovka-futbolky', title: 'Розмальовка футболки', kids: { price: 600 }, adults: { price: 600 } },
  { slug: 'neonove-malyuvannya', title: 'Малювання неонове', kids: { price: 680 }, adults: { price: 680 } },
  { slug: 'bentotort', title: 'Бентоторт', kids: { price: 700 }, adults: { price: 700 } },
  /* Разовый мастер-класс, не путать с регулярным занятием робототехнікою
     за 350 ₴ — у них разная длительность и программа. Подписано на странице. */
  { slug: 'robototehnika-mk', title: 'Робототехніка (майстер-клас)', kids: { price: 250 }, adults: null },
  { slug: 'malyuvannya-na-derevi', title: 'Малювання на дереві', kids: { price: 250 }, adults: null },
  { slug: 'fotoramka', title: 'Створення фоторамки', kids: { price: 450 }, adults: null },
  { slug: 'krystal-art', title: 'Малювання стразами (кристал арт)', kids: { price: 600 }, adults: null },
  { slug: 'teksturna-pasta', title: 'Малювання текстурною пастою', kids: { price: 650 }, adults: null },
  { slug: 'malyuvannya-kavoyu', title: 'Малювання кавою', kids: null, adults: { price: 250 } },
  { slug: 'van-gogh-art', title: 'Van Gogh Art', kids: null, adults: { price: 680, from: true } },
  /* «Мама + дитина» и «3D арт» временно скрыты: в детском и взрослом прайсах
     у них расходятся цены (650 против «від 150», 580 против 150).
     Вернуть, когда владелица подтвердит правильные. */
];

export function masterClassesFor(audience: 'kids' | 'adults'): MasterClass[] {
  return MASTER_CLASSES.filter((m) => m[audience] !== null).sort((a, b) => {
    const pa = a[audience]!.price;
    const pb = b[audience]!.price;
    return pa - pb;
  });
}

/* ============================================================
   FAQ — ответы подтверждены владелицей (17.09.2026).
   Менять формулировки только по её согласованию: это её слова,
   а не наши догадки.
   ============================================================ */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'З якого віку можна відвідувати заняття?',
    a: 'У студії «Творчі» є заняття для дітей від 3 років. Групи формуються за віком та рівнем підготовки, тому програма й складність завдань адаптуються під кожну дитину.',
  },
  {
    q: 'Які заняття є у студії?',
    a: 'Можна обрати заняття для розвитку, творчості та навчання: малювання, ліплення, шиття, англійську мову, сенсорику, ранній розвиток, підготовку до школи, робототехніку, репетиторство та інші напрямки. Також регулярно з’являються тематичні заняття й майстер-класи. Актуальний перелік, вік дітей і вільні місця можна переглянути в розкладі.',
  },
  {
    q: 'Що потрібно брати із собою на заняття?',
    a: 'Для більшості занять усе необхідне вже є у студії. Якщо для певного напрямку потрібно щось принести із собою, ми обов’язково повідомимо про це заздалегідь.',
  },
  {
    q: 'Як оплатити заняття?',
    a: 'Оплатити заняття можна зручним способом — готівкою або безготівково. Залежно від обраного напрямку можна придбати абонемент або оплатити разове заняття. Актуальна вартість зазначена в розділі «Розклад і ціни».',
  },
  {
    q: 'Чи є індивідуальні заняття?',
    a: 'Так, для деяких напрямків доступні індивідуальні заняття. Викладач працює з дитиною один на один і формує програму відповідно до її рівня, темпу та цілей. Вартість і доступний час уточнюйте в адміністратора.',
  },
  {
    q: 'Що робити, якщо дитина пропустила заняття?',
    a: 'Якщо дитина захворіла, обов’язково попередьте адміністратора завчасно. Після одужання у вас буде 7 днів, щоб відпрацювати пропущене заняття, приєднавшись до іншої відповідної групи. Якщо дитина не може прийти через сімейні обставини або зміну планів, також попередьте завчасно — тоді заняття можна відпрацювати в іншій групі протягом терміну дії абонемента. Якщо про відсутність не попередили заздалегідь і дитина просто не прийшла, заняття вважається використаним і не переноситься.',
  },
  {
    q: 'Чи можна придбати подарунковий сертифікат?',
    a: 'Так. Можна придбати подарунковий сертифікат як для дитини, так і для дорослого: на заняття, дитячий або дорослий майстер-клас, індивідуальне заняття чи на певну суму.',
  },
  {
    q: 'Чи можна прийти на пробне заняття?',
    a: `Так. Пробне заняття коштує ${TRIAL_PRICE} ₴ — можна познайомитися зі студією та викладачем і зрозуміти, наскільки дитині підходить обраний напрямок.`,
  },
  {
    q: 'Як записатися?',
    a: 'Оберіть напрямок і зручний час у розкладі та залиште заявку на сайті або зв’яжіться з адміністратором. Ми підтвердимо наявність місця й надамо всю необхідну інформацію.',
  },
];

/* ---------- помощники ---------- */

export function lessonsByAge(age: AgeId): Lesson[] {
  return LESSONS.filter((l) => l.age === age);
}

export function ageGroup(age: AgeId): AgeGroup {
  const found = AGE_GROUPS.find((g) => g.id === age);
  if (!found) throw new Error('Unknown age group: ' + age);
  return found;
}

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

