import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeasonBanner from '@/components/season/SeasonBanner';
import { currentSeason } from '@/lib/season';
import Analytics from '@/components/Analytics';
import { SITE_URL } from '@/lib/site';
import { STUDIO } from '@/lib/data';
import './fonts.css';
import './globals.css';
import './theme.css';
import './season.css';
import './inner.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TVORCHI ART STUDIO — арт-студія та школа розвитку в Кременчуці',
  description:
    'Малювання, ліплення, робототехніка, англійська та підготовка до школи для дітей 3–8 років. Дні народження та майстер-класи. Раківка та Молодіжний.',
  openGraph: {
    title: 'TVORCHI ART STUDIO',
    description: 'Арт-студія, майстер-класи та школа розвитку в Кременчуці. Від 3 років.',
    locale: 'uk_UA',
    type: 'website',
    siteName: 'TVORCHI ART STUDIO',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'TVORCHI ART STUDIO' }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFF7EE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const season = currentSeason();
  return (
    <html lang="uk">
      <body data-season={season ?? undefined}>
        {season === 'halloween' && <SeasonBanner />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()) }} />
        <Header />
        <div className="shell">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

/* Разметка для Google: карточка организации с телефоном, адресом и Instagram. */
function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ChildCare',
    name: STUDIO.name,
    description: 'Арт-студія та школа розвитку для дітей від 3 років: малювання, ліплення, робототехніка, англійська, підготовка до школи, майстер-класи та дні народження.',
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    telephone: STUDIO.phone.replace(/\s/g, ''),
    sameAs: [STUDIO.instagram],
    areaServed: STUDIO.city,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Лесі Українки, 37А',
      addressLocality: 'Кременчук',
      addressCountry: 'UA',
    },
    priceRange: '₴₴',
  };
}
