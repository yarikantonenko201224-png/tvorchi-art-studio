import Link from 'next/link';
import type { Announcement } from '@/lib/announcements';

/* Карточка-афиша события: обложка с наклейкой даты и теги.
   Внутренние ссылки (страница табору, поездки) ведут туда, остальное в /anonsy. */

const MONTHS_SHORT = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
const EVENT_COLORS = ['var(--plum)', 'var(--plush)', 'var(--brand-orange)'];

export function eventDate(a: Announcement) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/.exec(a.startsAt);
  if (!m) return { day: '', month: '', time: '' };
  const time = m[4] && `${m[4]}:${m[5]}` !== '00:00' ? `${m[4]}:${m[5]}` : '';
  return { day: String(Number(m[3])), month: MONTHS_SHORT[Number(m[2]) - 1], time };
}

export default function EventCard({ a, i, fallbackHref = '/anonsy', withFull = false }: { a: Announcement; i: number; fallbackHref?: string; withFull?: boolean }) {
  const d = eventDate(a);
  const internal = a.link?.startsWith('/');
  const href = internal ? a.link! : fallbackHref;
  const body = (
    <>
      <div
        className={`lp-event-cover${a.cover ? '' : ' lp-event-cover--art'}`}
        style={a.cover ? undefined : { background: EVENT_COLORS[i % EVENT_COLORS.length] }}
      >
        {a.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover} alt="" loading="lazy" />
        ) : (
          <span>{a.title}</span>
        )}
        {d.day && (
          <span className="lp-event-date">
            <b>{d.day}</b>
            <small>{d.month}{d.time ? `, ${d.time}` : ''}</small>
          </span>
        )}
      </div>
      <div className="lp-event-body">
        <h3>{a.title}</h3>
        {a.short && <p>{a.short}</p>}
        {withFull && a.full && <p className="lp-event-full">{a.full}</p>}
        <div className="lp-event-meta">
          {a.place && <span className="lp-tag">{a.place}</span>}
          {a.age && <span className="lp-tag">{a.age}</span>}
          {a.price && <span className="lp-tag">{a.price}</span>}
          {a.seats === 0 && <span className="lp-tag lp-tag--hot">місць немає</span>}
          {typeof a.seats === 'number' && a.seats > 0 && a.seats <= 5 && (
            <span className="lp-tag lp-tag--hot">лишилось {a.seats}</span>
          )}
        </div>
        {withFull && <span className="lp-event-go">{internal ? 'Програма і запис →' : 'Детальніше →'}</span>}
      </div>
    </>
  );
  const style = { ['--rv-delay' as string]: `${(i % 3) * 0.12}s` };
  if (!internal && withFull && a.link) {
    return <a href={a.link} className="lp-event" data-reveal style={style} target={a.link.startsWith('http') ? '_blank' : undefined} rel="noopener">{body}</a>;
  }
  return <Link href={href} className="lp-event" data-reveal style={style}>{body}</Link>;
}
