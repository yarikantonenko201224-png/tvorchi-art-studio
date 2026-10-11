'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STUDIO, TRIAL_PRICE } from '@/lib/data';

/* Шапка для всех экранов.
   Телефон: логотип, кнопка записи и меню на весь экран (крупные пункты под палец).
   Десктоп: полное меню, телефон и кнопка записи. */

export const NAV = [
  { href: '/rozklad', label: 'Розклад і ціни' },
  { href: '/maister-klasy', label: 'Майстер-класи' },
  { href: '/den-narodzhennya', label: 'День народження' },
  { href: '/anonsy', label: 'Анонси' },
  { href: '/sertyfikaty', label: 'Сертифікати' },
  { href: '/faq', label: 'Питання' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // меню закрывается при переходе и не даёт странице прокручиваться под собой
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (pathname?.startsWith('/admin')) return <AdminHeader />;

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="hdr-inner">
        <Link href="/" className="hdr-logo" aria-label="TVORCHI — на головну">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="TVORCHI art studio" width={48} height={46} />
        </Link>

        <nav className="hdr-nav" aria-label="Головне меню">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a className="hdr-phone" href={STUDIO.phoneHref}>{STUDIO.phone}</a>
        <Link className="btn hdr-cta" href="/zapys" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Пробне за {TRIAL_PRICE} ₴
        </Link>

        <button
          type="button"
          className="hdr-burger"
          aria-label="Відкрити меню"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>
      </div>

      {/* Меню рендерим прямо в body: у шапки есть backdrop-filter, а он
          делает её «рамкой» для position:fixed, и меню сжималось до высоты шапки. */}
      {open && createPortal(
        <div className="hdr-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Меню">
          <div className="hdr-menu-top">
            <Link href="/" className="hdr-logo" aria-label="TVORCHI — на головну">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.png" alt="TVORCHI art studio" width={48} height={46} />
            </Link>
            <button type="button" className="hdr-burger" style={{ display: 'grid' }} aria-label="Закрити меню" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="Головне меню">
            <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Головна</Link>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
            <Link href="/pidbir" aria-current={pathname === '/pidbir' ? 'page' : undefined}>Підібрати заняття</Link>
          </nav>
          <div className="hdr-menu-foot">
            <Link className="btn" href="/zapys">Записатися на пробне · {TRIAL_PRICE} ₴</Link>
            <a className="btn btn--ghost" href={STUDIO.phoneHref}>Подзвонити {STUDIO.phone}</a>
            <div className="hdr-menu-msg">
              <a className="btn btn--ghost" href={STUDIO.telegram} target="_blank" rel="noopener">Telegram</a>
              <a className="btn btn--ghost" href={STUDIO.viber}>Viber</a>
              <a className="btn btn--ghost" href={STUDIO.instagram} target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}

/* В админке — без рекламного меню: только логотип и ссылка на сайт. */
function AdminHeader() {
  return (
    <header className="hdr is-scrolled">
      <div className="hdr-inner">
        <Link href="/" className="hdr-logo" aria-label="Відкрити сайт">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="TVORCHI art studio" width={48} height={46} />
        </Link>
        <span className="t-small" style={{ fontWeight: 700 }}>Адмінка</span>
        <Link href="/" className="t-small" style={{ marginLeft: 'auto', fontWeight: 700 }} target="_blank">
          Відкрити сайт
        </Link>
      </div>
    </header>
  );
}
