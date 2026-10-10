/* Адрес сайта для SEO (sitemap, canonical, Open Graph).
   На хостинге задайте NEXT_PUBLIC_SITE_URL=https://ваш-домен — без слэша в конце. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tvorchi-art-studio.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'TVORCHI ART STUDIO';
