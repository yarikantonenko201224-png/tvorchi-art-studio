import Link from 'next/link';
import Logo from './Logo';
import { STUDIO, TRIAL_PRICE } from '@/lib/data';

/* Шапка для широких экранов. На мобильном скрыта: там навигация живёт
   в хабе и в липкой нижней панели, а место наверху слишком дорого. */

const NAV = [
  { href: '/rozklad', label: 'Розклад і ціни' },
  { href: '/maister-klasy', label: 'Майстер-класи' },
  { href: '/den-narodzhennya', label: 'День народження' },
  { href: '/anonsy', label: 'Анонси' },
  { href: '/sertyfikaty', label: 'Сертифікати' },
  { href: '/faq', label: 'Питання' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo href="/" height={44} />

        <nav className="site-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-cta">
          <a href={STUDIO.phoneHref} className="site-phone">{STUDIO.phone}</a>
          <Link className="btn btn--small" href="/zapys" style={{ display: 'grid', placeItems: 'center' }}>
            Пробне за {TRIAL_PRICE} ₴
          </Link>
        </div>
      </div>
    </header>
  );
}
