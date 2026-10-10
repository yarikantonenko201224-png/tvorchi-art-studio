'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STUDIO } from '@/lib/data';
import { NAV } from './Header';

/* Подвал: контакты, обе локации, меню и огромное слово TVORCHI,
   которое уходит за нижний край, как буквы на стене студии. */
export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="ftr">
      <div className="ftr-inner">
        <div className="ftr-grid">
          <div className="ftr-col">
            <h3>TVORCHI art studio</h3>
            <p>Арт-студія, майстер-класи та школа розвитку для дітей від 3 років. Кременчук.</p>
          </div>
          <div className="ftr-col">
            <h3>Де ми</h3>
            <ul>
              <li>Раківка: усі вікові групи</li>
              <li>Молодіжний: вул. Лесі Українки, 37А</li>
            </ul>
          </div>
          <div className="ftr-col">
            <h3>Зв’язок</h3>
            <ul>
              <li><a href={STUDIO.phoneHref}>{STUDIO.phone}</a></li>
              <li><a href={STUDIO.instagram} target="_blank" rel="noopener">Instagram</a></li>
              <li><a href={STUDIO.viber}>Viber</a></li>
            </ul>
          </div>
          <div className="ftr-col">
            <h3>Розділи</h3>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ftr-meta">
          <span>© {new Date().getFullYear()} TVORCHI art studio · <Link href="/polityka-konfidentsiinosti">Політика конфіденційності</Link></span>
          <span>
            Сайт зроблено в <a href="https://nexora-web.studio" target="_blank" rel="noopener">NEXORA</a>
          </span>
        </div>

        <div className="ftr-word" aria-hidden="true">
          {"TVORCHI".split("").map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>
    </footer>
  );
}
