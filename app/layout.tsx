import type { Metadata, Viewport } from 'next';
import { Rubik, Caveat } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-rubik',
  display: 'swap',
});

/* Рукописная гарнитура — только для логотипа-заглушки, пока не пришёл SVG.
   Слово «TVORCHI» латиницей, поэтому кириллический сабсет не нужен. */
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TVORCHI ART STUDIO — арт-студія та школа розвитку в Кременчуці',
  description:
    'Малювання, ліплення, робототехніка, англійська та підготовка до школи для дітей 3–8 років. Дні народження та майстер-класи. Раківка та Молодіжний.',
  openGraph: {
    title: 'TVORCHI ART STUDIO',
    description: 'Арт-студія, майстер-класи та школа розвитку в Кременчуці. Від 3 років.',
    locale: 'uk_UA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${rubik.variable} ${caveat.variable}`}>
      <body>
        <Header />
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
