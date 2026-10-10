import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Capy from '@/components/Capy';
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
    <div className="inner">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <PageHero
        tone="mint"
        crumb="Питання"
        kicker="запитуйте сміливо"
        title={<>Питання <em>та відповіді</em></>}
        lead="Зібрали те, що батьки питають найчастіше. Якщо чогось не знайшли, телефонуйте або пишіть, відповімо швидко."
        art={<Capy size={210} mood="wink" />}
      />

      <div className="sheet">
        <div className="faq-layout">
          <div className="faq2">
            {FAQ.map((item, i) => (
              <details key={item.q} className="faq" open={i === 0}>
                <summary>
                  <span>{item.q}</span>
                  <span className="faq-sign" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <aside className="faq-help">
            <h2 className="t-h3">Не знайшли відповіді?</h2>
            <p>Напишіть або зателефонуйте нам, із радістю допоможемо.</p>
            <a className="btn" href={STUDIO.phoneHref}>{STUDIO.phone}</a>
            <a className="btn btn--ghost" href={STUDIO.instagram} target="_blank" rel="noopener">Direct в Instagram</a>
            <Link className="faq-help-link" href="/zapys">або одразу записатися на пробне →</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
