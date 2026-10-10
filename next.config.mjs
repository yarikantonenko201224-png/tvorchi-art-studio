/* Адрес Supabase берём из окружения: так next/image пропустит картинки
   и с нестандартного адреса (например, тестовой копии базы). */
const supabaseHost = (() => {
  try { return new URL(process.env.SUPABASE_URL ?? '').hostname; } catch { return null; }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
