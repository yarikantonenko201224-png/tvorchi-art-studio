/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* Мобильный — главный сценарий, поэтому dev-сервер регулярно открывается
     с телефона по локальному IP. Без этого Next ругается на cross-origin
     запросы к /_next/*, а в будущих версиях начнёт их блокировать. */
  allowedDevOrigins: ['192.168.1.182', 'localhost'],
};

export default nextConfig;
