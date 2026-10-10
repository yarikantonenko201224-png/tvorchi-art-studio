/* Подготовка фото к загрузке — выполняется в браузере админки.

   Фото с телефона весит 3–8 МБ и имеет 4000+ px по стороне. Сайту нужно
   максимум 1600 px, а сервер Vercel не принимает запросы тяжелее 4,5 МБ.
   Поэтому уменьшаем прямо на телефоне: загрузка быстрее, хранилище легче,
   и ориентацию кадра браузер уже учёл (EXIF-поворот применяется при декодировании). */

const MAX_SIDE = 1600;
const QUALITY = 0.85;

export async function resizeImage(file: File, maxSide = MAX_SIDE): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      'Не вдалося відкрити фото. Якщо це формат HEIC з iPhone — оберіть фото через «Фото» ' +
      'або в налаштуваннях камери поставте «Найсумісніший».',
    );
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Браузер не підтримує обробку фото');
  ctx.fillStyle = '#ffffff'; // прозрачный PNG → белый фон, а не чёрный
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
  if (!blob) throw new Error('Не вдалося стиснути фото');
  return blob;
}

/** Уменьшить и загрузить. Возвращает путь в хранилище и публичную ссылку. */
export async function uploadImage(
  file: File,
  folder: 'gallery' | 'announcements' | 'mk',
): Promise<{ path: string; url: string }> {
  const blob = await resizeImage(file);
  const form = new FormData();
  form.append('file', blob, 'photo.jpg');
  form.append('folder', folder);

  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  const data = (await res.json().catch(() => ({}))) as { path?: string; url?: string; error?: string };
  if (!res.ok || !data.path || !data.url) throw new Error(data.error || 'Не вдалося завантажити фото');
  return { path: data.path, url: data.url };
}

/** Общий помощник для JSON-запросов админки: бросает ошибку с понятным текстом. */
export async function adminFetch(url: string, init: RequestInit): Promise<void> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || 'Не вдалося зберегти');
  }
}
