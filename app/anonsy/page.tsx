import Link from 'next/link';
import PageHero from '@/components/PageHero';
import EventCard from '@/components/EventCard';
import Reveal from '@/components/home/Reveal';
import { getAnnouncements, upcoming } from '@/lib/announcements';
import { STUDIO } from '@/lib/data';
import { nowKyivLocal } from '@/lib/content';
import { PARTIES, withEvents } from '@/lib/events';
import { currentSeason } from '@/lib/season';
import '../home.css';

/* Анонсы и галерея ведутся в админке: страница обновляется не реже раза в минуту,
   а после сохранения в админке — сразу (revalidateTag). */
export const revalidate = 60;

export const metadata = {
  title: 'Анонси та події — TVORCHI ART STUDIO',
  description:
    'Найближчі події студії TVORCHI у Кременчуці: табори, поїздки, тематичні вечірки, майстер-класи та дні відкритих дверей.',
};

export default async function AnnouncementsPage() {
  const now = nowKyivLocal();
  const events = upcoming(withEvents(await getAnnouncements(), now), now);
  const parties = currentSeason() === 'halloween' && now <= PARTIES.until;

  return (
    <div className="inner">
      <Reveal />
      <PageHero
        tone="pink"
        crumb="Анонси"
        kicker="не пропустіть"
        title={<>Анонси <em>та події</em></>}
        lead="Табори, поїздки, тематичні вечірки та майстер-класи. Події, що минули, зникають зі списку самі."
        stickers={[
          { big: String(events.length), small: events.length === 1 ? 'подія попереду' : 'події попереду', color: '#FFF1BF' },
          { big: '📸', small: 'спершу в Instagram', color: '#ECE4FF' },
        ]}
      >
        <a className="btn btn--ghost" href={STUDIO.instagram} target="_blank" rel="noopener">Instagram студії</a>
      </PageHero>

      <section className="wrap in-sec" style={{ paddingTop: 48 }}>
        {events.length ? (
          <div className="lp-events lp-events--all">
            {events.map((a, i) => <EventCard key={a.id} a={a} i={i} withFull />)}
          </div>
        ) : (
          <div className="lp-events-empty">
            <p>Найближчим часом запланованих подій немає. Слідкуйте за Instagram: там ми анонсуємо все першими.</p>
          </div>
        )}

        {parties && (
          <Link href={`/anonsy/${PARTIES.slug}`} className="an-party" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PARTIES.cover} alt="" loading="lazy" />
            <div>
              <span className="t-hand">під вашу дату</span>
              <h2>Halloween-вечірка для вашої компанії</h2>
              <p>Frankenstein, Wednesday, Цифровий цирк та інші сюжети. У студії або на вашій локації.</p>
              <span className="btn">Обрати тематику</span>
            </div>
          </Link>
        )}
      </section>
    </div>
  );
}
