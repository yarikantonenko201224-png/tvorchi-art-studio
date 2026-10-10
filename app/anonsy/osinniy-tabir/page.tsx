import type { Metadata } from 'next';
import Link from 'next/link';
import Capy from '@/components/Capy';
import Reveal from '@/components/home/Reveal';
import Bats from '@/components/season/Bats';
import { AUTUMN_CAMP as CAMP } from '@/lib/events';
import { STUDIO } from '@/lib/data';
import CampForm from './CampForm';
import PhoneVideo from '@/components/events/PhoneVideo';
import './camp.css';

export const metadata: Metadata = {
  title: 'Осінній страшний табір 26–30 жовтня · TVORCHI ART STUDIO',
  description:
    'Осінній табір у Кременчуці для дітей: лазертаг, квест і страшні експерименти, поїздка на сироварню, кінодень, кулінарний майстер-клас і велика Halloween-вечірка. 08:00–16:00 або пів дня.',
  openGraph: {
    title: 'Осінній страшний табір у TVORCHI',
    description: CAMP.subtitle,
    images: [CAMP.poster],
  },
};

const HIGHLIGHT_ICONS = ['🎯', '🧪', '🧀', '🎨', '🎬', '🧁', '🎃', '🏅'];
const DIRECT = 'https://ig.me/m/tvorchi_artstudio_';

export default function CampPage() {
  return (
    <div className="cp">
      <Reveal />

      {/* ---------- ночной первый экран ---------- */}
      <section className="cp-hero">
        <Bats />
        <span className="cp-moon" aria-hidden="true" />
        <span className="cp-stars" aria-hidden="true" />
        <div className="wrap cp-hero-grid">
          <div className="cp-hero-text">
            <Link href="/anonsy" className="cp-back">← Усі події</Link>
            <span className="cp-dates">{CAMP.dates} · 5 днів</span>
            <h1 className="cp-title">
              Осінній <span className="cp-title-spooky">страшний</span> табір у&nbsp;TVORCHI
            </h1>
            <p className="cp-sub">{CAMP.subtitle}</p>
            <div className="cp-cta">
              <a className="btn" href="#zapys">Записати дитину</a>
              <a className="btn btn--ghost cp-btn-dark" href={DIRECT} target="_blank" rel="noopener">
                Написати «{CAMP.directKeyword}» у Direct
              </a>
            </div>
            <ul className="cp-formats">
              {CAMP.formats.map((f) => (
                <li key={f.title}><b>{f.title}</b><span>{f.time}</span></li>
              ))}
            </ul>
          </div>
          <a className="cp-poster" href={CAMP.poster} target="_blank" rel="noopener" aria-label="Відкрити афішу табору">
            <span className="cp-tape" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CAMP.poster} alt="Афіша: Осінній страшний табір у TVORCHI, 26–30 жовтня" width={1079} height={1350} />
          </a>
        </div>
        <svg className="cp-hero-edge" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 L0 30 Q 60 0 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 L1440 60 Z" />
        </svg>
      </section>

      {/* ---------- что будет ---------- */}
      <section className="cp-sec">
        <div className="wrap">
          <h2 className="t-h2" data-reveal>Що чекає на дітей</h2>
          <ul className="cp-high">
            {CAMP.highlights.map((h, i) => (
              <li key={h} data-reveal style={{ ['--rv-delay' as string]: `${i * 0.06}s` }}>
                <span aria-hidden="true">{HIGHLIGHT_ICONS[i]}</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- видео ---------- */}
      <section className="cp-sec cp-sec--video">
        <div className="wrap cp-video-grid">
          <div data-reveal>
            <span className="t-hand">чому до нас повертаються</span>
            <blockquote className="cp-quote">«Мамо, а ми завтра знову йдемо?»</blockquote>
            <p className="t-lead">
              Таку фразу діти приносять додому щовечора після табору. І це, мабуть, найкращий показник
              того, що день був особливим: лазертаг, поїздки, творчість і нові друзі.
            </p>
            <a className="btn" href="#zapys" style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none', marginTop: 22 }}>
              Хочу так само
            </a>
          </div>
          <div className="cp-video-wrap" data-reveal style={{ ['--rv-delay' as string]: '.12s' }}>
            <span className="cp-video-sticker" aria-hidden="true">як це було ↘</span>
            <PhoneVideo src="/events/tabir-osin/video.mp4" webm="/events/tabir-osin/video.webm" poster="/events/tabir-osin/video-poster.jpg" label="Відео з табору TVORCHI: діти грають у лазертаг, їздять на екскурсії та творять" />
          </div>
        </div>
      </section>

      {/* ---------- программа по дням ---------- */}
      <section className="cp-sec cp-sec--program">
        <div className="wrap">
          <div className="cp-head" data-reveal>
            <h2 className="t-h2">Програма по днях</h2>
            <span className="t-hand">щодня з 08:00 до 16:00</span>
          </div>
          <ol className="cp-days">
            {CAMP.days.map((d) => (
              <li key={d.n} className="cp-day" data-reveal>
                <a className="cp-day-poster" href={d.poster} target="_blank" rel="noopener" aria-label={`Афіша дня ${d.n}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.poster} alt={`День ${d.n}: ${d.title}`} loading="lazy" width={1079} height={1350} />
                </a>
                <div className="cp-day-body">
                  <div className="cp-day-top">
                    <span className="cp-day-n">День {d.n}</span>
                    <span className="cp-day-date">{d.date}</span>
                  </div>
                  <h3 className="cp-day-title">{d.title}</h3>
                  <ul>
                    {d.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  {d.note && <p className="cp-day-note">{d.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- запись ---------- */}
      <section className="cp-sec" id="zapys">
        <div className="wrap cp-form-grid">
          <div className="cp-form-side" data-reveal>
            <h2 className="t-h2">Записати дитину в табір</h2>
            <p className="t-lead">
              Залиште телефон, і ми зателефонуємо, розповімо про вартість і відповімо на всі питання.
              Місць у групі небагато.
            </p>
            <p className="cp-or">
              Або напишіть слово <b>«{CAMP.directKeyword}»</b> у{' '}
              <a href={DIRECT} target="_blank" rel="noopener">Direct Instagram</a>, чи зателефонуйте{' '}
              <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>.
            </p>
            <span className="cp-form-capy" aria-hidden="true"><Capy size={170} hat mood="wink" /></span>
          </div>
          <CampForm />
        </div>
      </section>
    </div>
  );
}
