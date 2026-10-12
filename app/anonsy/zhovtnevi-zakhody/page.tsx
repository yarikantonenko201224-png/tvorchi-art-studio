import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import EventForm from '@/components/events/EventForm';
import SessionChip from '@/components/events/SessionChip';
import CalendarItem from '@/components/events/CalendarItem';
import { OCT_SERIES as S, sessionLabel, sessionUpcoming, sessionKey } from '@/lib/events';
import { nowKyivLocal } from '@/lib/content';
import { STUDIO } from '@/lib/data';
import '@/components/events/events.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Жовтневі заходи 16.10–01.11 · TVORCHI ART STUDIO',
  description:
    'Осінні майстер-класи для дітей у Кременчуці: малюємо привида на полотні, осіння гірлянда, розпис пряників, гарбузи-арт і Halloween-вечірки. Раківка та Молодіжний.',
  openGraph: { title: S.question, description: S.intro, images: [S.cover] },
};

const DIRECT = 'https://ig.me/m/tvorchi_artstudio_';
const WEEKDAY = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const MONTH = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];

export default function OctoberPage() {
  const now = nowKyivLocal();
  const all = S.events.flatMap((e) => e.sessions.map((s) => ({ e, s })));
  const upcoming = all.filter(({ s }) => sessionUpcoming(s, now)).sort((a, b) => sessionKey(a.s).localeCompare(sessionKey(b.s)));
  const optionOf = (title: string, s: (typeof all)[number]['s']) => `${title} · ${s.place} · ${sessionLabel(s)}`;

  return (
    <div className="oc">
      <Reveal />

      <section className="oc-hero">
        <div className="wrap oc-hero-grid">
          <div>
            <Link href="/anonsy" className="ev-back ev-back--ink">← Усі події</Link>
            <span className="oc-range">{S.range}</span>
            <h1 className="oc-title">Яку осінню пригоду обере <em>твоя дитина?</em></h1>
            <p className="oc-sub">{S.intro} Цього разу будемо:</p>
            <ul className="oc-doing">
              {S.doing.map((d, i) => (
                <li key={d.text} style={{ ['--d' as string]: `${0.2 + i * 0.09}s` }}><span aria-hidden="true">{d.icon}</span>{d.text}</li>
              ))}
            </ul>
            <div className="ev-cta">
              <a className="btn" href="#kalendar">Обрати дату</a>
              <a className="btn btn--ghost" href={DIRECT} target="_blank" rel="noopener">Написати в Direct</a>
            </div>
          </div>
          <a className="oc-cover" href={S.cover} target="_blank" rel="noopener" aria-label="Відкрити афішу">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={S.cover} alt="Афіша: Жовтневі заходи разом із TVORCHI, 16.10–01.11" width={1080} height={1350} />
          </a>
        </div>
      </section>

      {/* ---------- календар ---------- */}
      <section className="wrap oc-sec" id="kalendar">
        <div className="oc-head" data-reveal>
          <h2 className="t-h2">Усі дати</h2>
          <span className="t-hand">натисни дату, щоб записатися ↓</span>
        </div>
        {upcoming.length ? (
          <ol className="oc-cal">
            {upcoming.map(({ e, s }, i) => {
              const d = new Date(`${s.date}T12:00:00`);
              return (
                <li key={e.id + sessionKey(s)} data-reveal style={{ ['--rv-delay' as string]: `${(i % 4) * 0.06}s`, ['--tone' as string]: e.tone }}>
                  <CalendarItem value={optionOf(e.title, s)}>
                    <span className="oc-cal-date"><b>{d.getDate()}</b><small>{MONTH[d.getMonth()]}, {WEEKDAY[d.getDay()]}</small></span>
                    <span className="oc-cal-body">
                      <b><span aria-hidden="true">{e.icon}</span> {e.title}</b>
                      <small><i className={`oc-dot oc-dot--${s.place === 'Раківка' ? 'r' : 'm'}`} />{s.place} · {s.time}</small>
                    </span>
                  </CalendarItem>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="t-lead">Цьогорічні жовтневі заходи вже минули. Дякуємо всім, хто був з нами!</p>
        )}
      </section>

      {/* ---------- заходи ---------- */}
      <section className="wrap oc-sec">
        <div className="oc-events">
          {S.events.map((e, i) => (
            <article key={e.id} id={e.id} className="oc-event" data-reveal style={{ ['--tone' as string]: e.tone, ['--tilt' as string]: `${i % 2 ? 1 : -1}deg` }}>
              <a className="oc-event-poster" href={e.poster} target="_blank" rel="noopener" aria-label={`Афіша: ${e.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.poster} alt="" loading="lazy" />
              </a>
              <div className="oc-event-body">
                <h3><span aria-hidden="true">{e.icon}</span> {e.title}</h3>
                <p>{e.lead}</p>
                <div className="oc-chips">
                  {e.sessions.map((s) => (
                    <SessionChip key={sessionKey(s)} value={optionOf(e.title, s)} place={s.place} label={sessionLabel(s)} past={!sessionUpcoming(s, now)} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- запис ---------- */}
      {upcoming.length > 0 && (
        <section className="oc-sec oc-sec--form" id="zapys">
          <div className="wrap ev-form-grid">
            <div data-reveal>
              <h2 className="t-h2">Записатися на захід</h2>
              <p className="oc-sub">Оберіть дату й залиште телефон: ми зателефонуємо, підкажемо деталі й закріпимо місце.</p>
              <p className="ev-or">
                Або пишіть у <a href={DIRECT} target="_blank" rel="noopener">Direct Instagram</a>, допоможемо обрати захід.
                Телефон: <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>.
              </p>
            </div>
            <EventForm
              source="masterclass"
              event={S.title}
              groups={[{ key: 'session', label: 'Захід і дата', options: upcoming.map(({ e, s }) => optionOf(e.title, s)), required: true }]}
              count={{ key: 'kids', label: 'Скільки дітей', min: 1, max: 8, initial: 1 }}
              submitLabel="Записатися"
              doneText="Ми зателефонуємо, підтвердимо місце й розповімо деталі. До зустрічі в TVORCHI!"
            />
          </div>
        </section>
      )}
    </div>
  );
}
