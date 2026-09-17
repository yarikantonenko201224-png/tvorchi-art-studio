import Link from 'next/link';
import { FAQ, STUDIO } from '@/lib/data';

export const metadata = {
  title: 'Питання та відповіді — TVORCHI ART STUDIO',
  description:
    'З якого віку заняття, що брати із собою, як оплатити, що робити при пропуску, подарункові сертифікати та запис у студію TVORCHI в Кременчуці.',
};

/* Разметка FAQPage: Google показывает такие ответы прямо в выдаче.
   Для локального бизнеса это заметный источник переходов. */
function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>Питання та відповіді</h1>
        <p className="t-lead">
          Якщо чогось не знайшли — телефонуйте або пишіть, відповімо швидко.
        </p>

        <div style={{ marginTop: 22 }}>
          {FAQ.map((item) => (
            <details key={item.q} className="faq">
              <summary>
                <span>{item.q}</span>
                <span className="faq-sign" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <div className="note" style={{ marginTop: 24 }}>
          Не знайшли відповіді? Напишіть або зателефонуйте нам — із радістю допоможемо.
          <br />
          <a href={STUDIO.phoneHref} style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            {STUDIO.phone}
          </a>{' '}
          ·{' '}
          <a href={STUDIO.instagram} target="_blank" rel="noopener"
             style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            Direct в Instagram
          </a>
        </div>
      </div>

      <div className="bar">
        <a className="btn btn--ghost btn--small" href={STUDIO.phoneHref}
           style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Подзвонити
        </a>
        <Link className="btn" href="/zapys" style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
          Записатися
        </Link>
      </div>
    </>
  );
}
