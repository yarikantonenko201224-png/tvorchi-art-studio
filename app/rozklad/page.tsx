import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { PRICES, ALL_INCLUSIVE, GROUP_SIZE_MAX, TRIAL_PRICE } from '@/lib/data';
import ScheduleClient from './ScheduleClient';

export const metadata = {
  title: 'Розклад занять і ціни — TVORCHI ART STUDIO',
  description: 'Розклад занять у Раківці та на Молодіжному: малювання, ліплення, робототехніка, англійська, підготовка до школи. Ціни на разові заняття та абонементи.',
};

const PACKS = [
  { k: 'single', l: 'Разове заняття' },
  { k: 'pack4', l: 'Абонемент на 4' },
  { k: 'pack8', l: 'Абонемент на 8' },
  { k: 'pack12', l: 'Абонемент на 12' },
] as const;

export default function SchedulePage() {
  return (
    <div className="inner">
      <PageHero
        tone="lilac"
        crumb="Розклад і ціни"
        kicker="тиждень у TVORCHI"
        title={<>Розклад <em>і ціни</em></>}
        lead={<>Раківка та Молодіжний. Групи до {GROUP_SIZE_MAX} дітей, усі матеріали входять у вартість. Натисніть на заняття, щоб записатися.</>}
        stickers={[
          { big: `до ${GROUP_SIZE_MAX}`, small: 'дітей у групі', color: '#FFF1BF' },
          { big: `${TRIAL_PRICE} ₴`, small: 'пробне заняття', color: '#FFE0CC' },
          { big: '2', small: 'локації', color: '#D9F4EC' },
        ]}
      >
        <Link className="btn" href="/zapys">Записатися на пробне</Link>
        <Link className="btn btn--ghost" href="/pidbir">Підібрати напрям</Link>
      </PageHero>

      <div className="sheet">
        <div className="sheet-in">
          <ScheduleClient />
        </div>
      </div>

      <section className="wrap in-sec">
        <h2 className="t-h2">Ціни</h2>
        <div className="price3">
          <article className="price-card">
            <h3>Творчі та розвивальні</h3>
            <p className="t-small">Малювання, ліплення, ранній розвиток, сенсорика, підготовка до школи, англійська</p>
            <dl>{PACKS.map((p) => <div key={p.k}><dt>{p.l}</dt><dd>{PRICES.std[p.k]} ₴</dd></div>)}</dl>
          </article>
          <article className="price-card price-card--blue">
            <h3>Робототехніка</h3>
            <p className="t-small">Регулярні заняття за програмою курсу</p>
            <dl>{PACKS.map((p) => <div key={p.k}><dt>{p.l}</dt><dd>{PRICES.rob[p.k]} ₴</dd></div>)}</dl>
            <p className="t-small" style={{ marginTop: 12 }}>
              Разовий <Link href="/maister-klasy">майстер-клас із робототехніки</Link> коштує 250 ₴: одна зустріч без продовження.
            </p>
          </article>
          <article className="price-card price-card--hot">
            <span className="price-card-tag">−50% новим клієнтам</span>
            <h3>{ALL_INCLUSIVE.title}</h3>
            <p>{ALL_INCLUSIVE.description}.</p>
            <div className="price-card-big">
              <s>{ALL_INCLUSIVE.price} ₴</s>
              <b>{ALL_INCLUSIVE.promoPrice} ₴</b>
              <small>/ місяць</small>
            </div>
            <Link className="btn btn--yellow" href="/zapys">Спробувати</Link>
          </article>
        </div>
      </section>
    </div>
  );
}
