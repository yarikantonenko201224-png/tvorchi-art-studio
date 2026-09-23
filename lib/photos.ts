/* ============================================================
   ФОТО

   Файлы лежат в public/photos/. Пути здесь — это то, что видит браузер:
   public/photos/gallery/01.jpg → /photos/gallery/01.jpg

   ВНИМАНИЕ: сейчас это сгенерированные изображения-заглушки. Они нужны,
   чтобы владелица увидела, как страница выглядит с картинками. Перед
   настоящим запуском их обязательно заменить на реальные фото студии:
   выдавать чужие выдуманные работы за работы её детей нельзя.
   Файлы можно заменять «в лоб», не трогая код — имена те же.

   Позже источник переедет в админку; интерфейс компонентов не изменится.
   ============================================================ */

export interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

/* Работы детей — главная социальная доказательность студии.
   Первая в списке показывается крупнее остальных. */
export const GALLERY: Photo[] = [
  { src: '/photos/gallery/01.jpg', alt: 'Дитячий малюнок гуашшю: море на заході сонця з вітрильником' },
  { src: '/photos/gallery/02.jpg', alt: 'Картина з пластиліну: пшеничне поле під синім небом' },
  { src: '/photos/gallery/03.jpg', alt: 'Шопер, розмальований вручну великою помаранчевою квіткою' },
  { src: '/photos/gallery/04.jpg', alt: 'Керамічна тарілка, розписана червоними сердечками' },
  { src: '/photos/gallery/05.jpg', alt: 'Дитячий малюнок кота восковими олівцями та аквареллю' },
  { src: '/photos/gallery/06.jpg', alt: 'Підставка зі смоли із засушеними жовтими квітами всередині' },
];

/* Ключ — slug из MASTER_CLASSES. Фото есть не у всех: остальные карточки
   показывают фирменную кляксу, и это выглядит осмысленно, а не как дырка. */
export const MASTERCLASS_PHOTOS: Record<string, string> = {
  'liplennya-plastylin': '/photos/mk/liplennya.jpg',
  'holst-pidramnyk': '/photos/mk/holst.jpg',
  'rozpys-pryanykiv': '/photos/mk/pryanyky.jpg',
  'bentotort': '/photos/mk/bentotort.jpg',
  'rozmalovka-futbolky': '/photos/mk/futbolka.jpg',
  'neonove-malyuvannya': '/photos/mk/neon.jpg',
  'robototehnika-mk': '/photos/mk/robototehnika.jpg',
  'malyuvannya-na-skli': '/photos/mk/sklo.jpg',
};

/* Залы по локациям — ждут реальных снимков студии */
export const LOCATION_PHOTOS: Record<string, Photo> = {};

/* Свята — ждут реальных снимков */
export const BIRTHDAY_PHOTOS: Photo[] = [];

export function hasGallery(): boolean {
  return GALLERY.length > 0;
}

export function masterClassPhoto(slug: string): string | null {
  return MASTERCLASS_PHOTOS[slug] ?? null;
}
