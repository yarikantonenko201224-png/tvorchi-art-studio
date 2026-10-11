/* Адрес Supabase берём из окружения: так next/image пропустит картинки
   и с нестандартного адреса (например, тестовой копии базы). */
const supabaseHost = (() => {
  try { return new URL(process.env.SUPABASE_URL ?? '').hostname; } catch { return null; }
})();

/* Заголовки безопасности для всех страниц.
   CSP перечисляет, откуда странице разрешено грузить скрипты, картинки и карты:
   свой сайт, Google Analytics / Meta Pixel (если включены), карты Google
   и картинки из Supabase. В режиме разработки CSP не ставим: Next там
   использует eval для горячей перезагрузки. */
const isProd = process.env.NODE_ENV === 'production';
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // админку и её API не кешируем и не индексируем
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },

  /* Мобильный — главный сценарий, поэтому dev-сервер регулярно открывается
     с телефона по локальному IP. Без этого Next ругается на cross-origin
     запросы к /_next/*, а в будущих версиях начнёт их блокировать. */
  allowedDevOrigins: ['192.168.1.182', 'localhost'],

  /* Фото, которые студия загружает через админку, лежат в Supabase Storage.
     next/image оптимизирует только картинки с разрешённых адресов. */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      ...(supabaseHost && !supabaseHost.endsWith('.supabase.co')
        ? [{ hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
        : []),
    ],
  },
};

export default nextConfig;
