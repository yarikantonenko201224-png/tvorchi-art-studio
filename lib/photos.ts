/* ============================================================
   ФОТО

   Файлы лежат в public/photos/. Пока массивы пустые — блоки просто
   не рендерятся, сайт не ломается и не показывает дырки от картинок.
   Как только фото появятся, достаточно вписать их сюда.

   Позже это переедет в ту же таблицу администратора, что и анонсы,
   либо в админку — интерфейс компонентов не изменится.
   ============================================================ */

export interface Photo {
  src: string;       // /photos/gallery/01.jpg
  alt: string;       // что на фото — для доступности и поиска
  caption?: string;  // подпись под фото, если нужна
}

/* Работы детей и процесс — главная социальная доказательность студии.
   Порядок = порядок показа. Оптимально 6–12 штук. */
export const GALLERY: Photo[] = [];

/* Обложка к мастер-классу: ключ — slug из MASTER_CLASSES.
   Даже 5–6 фото уже сильно оживляют список. */
export const MASTERCLASS_PHOTOS: Record<string, string> = {};

/* Фото залов по слагам локаций: rakivka, molodizhny */
export const LOCATION_PHOTOS: Record<string, Photo> = {};

/* Праздники: 2–4 кадра для страницы дня рождения */
export const BIRTHDAY_PHOTOS: Photo[] = [];

export function hasGallery(): boolean {
  return GALLERY.length > 0;
}

export function masterClassPhoto(slug: string): string | null {
  return MASTERCLASS_PHOTOS[slug] ?? null;
}
