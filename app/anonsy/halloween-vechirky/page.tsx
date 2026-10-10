import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import Bats from '@/components/season/Bats';
import EventForm from '@/components/events/EventForm';
import ThemeCardButton from '@/components/events/ThemeCardButton';
import { PARTIES as P } from '@/lib/events';
import { STUDIO } from '@/lib/data';
import '@/components/events/events.css';

export const metadata: Metadata = {
  title: 'Halloween-вечірки для дітей у Кременчуці · TVORCHI ART STUDIO',
  description:
    'Готові тематичні Halloween-програми для класу, друзів чи групи: Frankenstein, Monster Party, Wednesday, Дуже дивні справи, Цифровий цирк, Таємниця Гарбузової вулиці. У студії або на вашій локації.',
  openGraph: { title: P.title, description: P.subtitle, images: [P.cover] },
};

const DIRECT = 'https://ig.me/m/tvorchi_artstudio_';
const LEAVES = [
  { x: '6%', d: 11, delay: 0, s: 26, r: '220deg' },
  { x: '22%', d: 14, delay: -5, s: 18, r: '-180deg' },
  { x: '48%', d: 12, delay: -9, s: 22, r: '260deg' },
  { x: '68%', d: 16, delay: -3, s: 30, r: '-240deg' },
  { x: '86%', d: 13, delay: -7, s: 20, r: '200deg' },
];

function Leaf() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 L23 11 L31 7 L28 16 L38 17 L30 23 L34 31 L24 28 L21 38 L19 38 L16 28 L6 31 L10 23 L2 17 L12 16 L9 7 L17 11 Z" />
    </svg>
  );
}

export default function PartiesPage() {
  return (
    <div className="pv">
      <Reveal />

      {/* ---------- первый экран при свечах ---------- */}
      <section className="pv-hero">
        <Bats />
        <div className="pv-leaves" aria-hidden="true">
          {LEAVES.map((l, i) => (
            <span key={i} style={{ left: l.x, width: l.s, animationDuration: `${l.d}s`, animationDelay: `${l.delay}s`, ['--r' as string]: l.r }}>
              <Leaf />
            </span>
          ))}
        </div>
        <div className="wrap pv-hero-grid">
          <div>
            <Link href="/anonsy" className="ev-back">← Усі події</Link>
            <span className="pv-kicker">Halloween разом із TVORCHI</span>
            <h1 className="pv-title">
              Не просто піти на&nbsp;Halloween, а&nbsp;<span>створити власну вечірку</span>
            </h1>
            <p className="pv-sub">
              Готові тематичні програми з квестами, творчістю, конкурсами та атмосферою,
              яка переносить дітей у зовсім іншу історію.
            </p>
            <ul className="pv-aud">
              {P.audiences.map((a) => <li key={a}>{a}</li>)}
            </ul>
            <div className="ev-cta">
              <a className="btn" href="#tematyky">Обрати тематику</a>
              <a className="btn btn--ghost ev-btn-dark" href={DIRECT} target="_blank" rel="noopener">
                Написати «{P.directKeyword}» у Direct
              </a>
            </div>
            <p className="pv-venues">
              {P.venues.map((v, i) => <span key={v}>{i > 0 && <i>або</i>}<b>{v}</b></span>)}
            </p>
          </div>
          <a className="pv-cover" href={P.cover} target="_blank" rel="noopener" aria-label="Відкрити афішу">
            <span className="pv-glow" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={P.cover} alt="Афіша: Halloween-вечірки, тематичні програми для вашої компанії" width={1080} height={1350} />
          </a>
        </div>
      </section>

      {/* ---------- тематики ---------- */}
      <section className="pv-sec" id="tematyky">
        <div className="wrap">
          <div className="pv-head" data-reveal>
            <h2 className="pv-h2">Оберіть свою історію</h2>
            <span className="t-hand">кожна вечірка зі своїм сюжетом ↓</span>
          </div>
          <div className="pv-themes">
            {P.themes.map((t, i) => (
              <article key={t.id} className="pv-theme" data-reveal style={{ ['--tone' as string]: t.tone, ['--rv-delay' as string]: `${(i % 3) * 0.1}s`, ['--tilt' as string]: `${[-1.2, 0.8, -0.6, 1, -0.9, 0.7][i]}deg` }}>
                <a className="pv-theme-img" href={t.poster} target="_blank" rel="noopener" aria-label={`Афіша: ${t.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.poster} alt="" loading="lazy" />
                </a>
                <div className="pv-theme-body">
                  <h3>{t.title}</h3>
                  <p>{t.lead}</p>
                  <ul>{t.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  <ThemeCardButton title={t.title} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- как это работает + доповнення ---------- */}
      <section className="pv-sec pv-sec--paper">
        <div className="wrap pv-two">
          <div data-reveal>
            <h2 className="pv-h2 pv-h2--ink">Ми вже все підготували</h2>
            <ol className="pv-steps">
              <li><b>Оберіть тематику</b><span>одну з програм вище</span></li>
              <li><b>Оберіть дату</b><span>і місце: у студії чи у вас</span></li>
              <li><b>Зберіть компанію</b><span>клас, друзів або групу</span></li>
            </ol>
            <p className="pv-rest">Про все інше подбаємо ми.</p>
          </div>
          <div data-reveal style={{ ['--rv-delay' as string]: '.12s' }}>
            <h2 className="pv-h2 pv-h2--ink">До кожної програми можна додати</h2>
            <ul className="pv-addons">
              {P.addons.map((a, i) => (
                <li key={a.title} style={{ ['--d' as string]: `${i * 0.08}s` }}><span aria-hidden="true">{a.icon}</span>{a.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- заявка ---------- */}
      <section className="pv-sec" id="zapys">
        <div className="wrap ev-form-grid">
          <div data-reveal>
            <h2 className="pv-h2">Забронювати вечірку</h2>
            <p className="pv-sub">
              Залиште контакти, і ми надішлемо програму, вартість та вільні дати.
              Створимо вечірку саме під вашу компанію.
            </p>
            <p className="ev-or">
              Або напишіть <b>«{P.directKeyword}»</b> у <a href={DIRECT} target="_blank" rel="noopener">Direct Instagram</a>,
              чи зателефонуйте <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>.
            </p>
          </div>
          <EventForm
            source="party"
            event={P.title}
            groups={[
              { key: 'theme', label: 'Тематика', options: [...P.themes.map((t) => t.title), 'Ще не обрали'], required: true },
              { key: 'venue', label: 'Де проводимо', options: P.venues, initial: P.venues[0] },
              { key: 'addons', label: 'Додати до програми', options: P.addons.map((a) => a.title), multi: true },
            ]}
            count={{ key: 'kids', label: 'Скільки дітей', min: 4, max: 40, initial: 10 }}
            withDate
            submitLabel="Забронювати вечірку"
            doneText="Ми надішлемо програму й вартість і разом підберемо дату. Буде страшенно весело!"
          />
        </div>
      </section>
    </div>
  );
}
