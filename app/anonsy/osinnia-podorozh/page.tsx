import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import EventForm from '@/components/events/EventForm';
import Countdown from '@/components/events/Countdown';
import { AUTUMN_TRIP as T } from '@/lib/events';
import { nowKyivLocal } from '@/lib/content';
import { STUDIO } from '@/lib/data';
import '@/components/events/events.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Осіння пригода 17 жовтня: Сорочин Яр і Ковалівка · TVORCHI ART STUDIO',
  description:
    'Одноденна поїздка з TVORCHI з Кременчука: Гарбуз-парк у Сорочиному Яру та екопарк Ковалівка. Тваринки, осінні локації, ігри та фото. Виїзд о 08:00.',
  openGraph: { title: 'Осіння пригода з TVORCHI', description: T.subtitle, images: [T.poster] },
};

const DIRECT = 'https://ig.me/m/tvorchi_artstudio_';

export default function TripPage() {
  const over = nowKyivLocal() > T.endsAt;

  return (
    <div className="tr">
      <Reveal />

      <section className="tr-hero">
        <div className="wrap tr-hero-grid">
          <div>
            <Link href="/anonsy" className="ev-back ev-back--ink">← Усі події</Link>
            <p className="tr-kicker">Одноденна поїздка · {T.date}</p>
            <h1 className="tr-title">
              <span className="tr-title-photo" style={{ backgroundImage: `url(${T.poster})` }}>Осіння</span>
              <span className="tr-title-ink">пригода</span>
            </h1>
            <p className="tr-route">Сорочин Яр <i>×</i> Ковалівка</p>
            <p className="tr-sub">
              На один день залишаємо місто та їдемо назустріч тваринам, гарбузам, осіннім
              локаціям, іграм і новим враженням.
            </p>
            <ul className="tr-tags">{T.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            {!over && <Countdown to={T.departISO} doneText="Ми вже в дорозі!" />}
            <div className="ev-cta">
              <a className="btn" href="#zapys">{over ? 'Як це було' : 'Забронювати місце'}</a>
              <a className="btn btn--ghost" href={DIRECT} target="_blank" rel="noopener">
                Написати «{T.directKeyword}» у Direct
              </a>
            </div>
          </div>
          <a className="tr-poster" href={T.poster} target="_blank" rel="noopener" aria-label="Відкрити афішу">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={T.poster} alt="Афіша: Осіння пригода, Сорочин Яр і Ковалівка, 17 жовтня" width={1080} height={1350} />
            <span className="tr-stamp" aria-hidden="true"><b>17</b>жовтня</span>
          </a>
        </div>
      </section>

      {/* ---------- маршрут ---------- */}
      <section className="tr-sec">
        <div className="wrap">
          <h2 className="tr-h2" data-reveal>Маршрут дня</h2>
          <ol className="tr-path">
            <li className="tr-stop tr-stop--time" data-reveal>
              <span className="tr-dot" aria-hidden="true">🚌</span>
              <b>{T.depart}</b>
              <p>Виїзд із Кременчука</p>
            </li>
            {T.stops.map((s, i) => (
              <li key={s.title} className="tr-stop" data-reveal style={{ ['--rv-delay' as string]: `${(i + 1) * 0.12}s` }}>
                <span className="tr-dot" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </li>
            ))}
            <li className="tr-stop tr-stop--time" data-reveal style={{ ['--rv-delay' as string]: '.36s' }}>
              <span className="tr-dot" aria-hidden="true">🏡</span>
              <b>{T.back}</b>
              <p>Повертаємося додому, орієнтовно</p>
            </li>
          </ol>
          <p className="tr-note" data-reveal>Попереду цілий день пригод, спілкування, веселощів та яскравих осінніх емоцій.</p>
        </div>
      </section>

      {/* ---------- заявка ---------- */}
      <section className="tr-sec tr-sec--form" id="zapys">
        <div className="wrap ev-form-grid">
          <div data-reveal>
            <h2 className="tr-h2">{over ? 'Поїздка вже відбулася' : 'Хочете поїхати з нами?'}</h2>
            {over ? (
              <p className="tr-sub">
                Дякуємо всім, хто був з нами! Фото з поїздки шукайте в Instagram, а наступні пригоди в розділі <Link href="/anonsy">Анонси</Link>.
              </p>
            ) : (
              <>
                <p className="tr-sub">Залиште контакти, і ми розповімо всі деталі та забронюємо місце.</p>
                <p className="ev-or">
                  Або напишіть <b>«{T.directKeyword}»</b> у <a href={DIRECT} target="_blank" rel="noopener">Direct Instagram</a>,
                  чи зателефонуйте <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>.
                </p>
              </>
            )}
          </div>
          {over ? (
            <a className="btn" href={STUDIO.instagram} target="_blank" rel="noopener" style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none' }}>
              Instagram студії
            </a>
          ) : (
            <EventForm
              source="trip"
              event={`${T.title}, ${T.date}`}
              count={{ key: 'seats', label: 'Скільки місць', min: 1, max: 10, initial: 2 }}
              submitLabel="Забронювати місце"
              doneText="Ми зателефонуємо, розповімо деталі поїздки та закріпимо за вами місця. До зустрічі 17 жовтня!"
            />
          )}
        </div>
      </section>
    </div>
  );
}
