import Link from 'next/link';
import Plush from '@/components/home/Plush';
import Capy from '@/components/Capy';
import EventCard from '@/components/EventCard';
import Places from '@/components/Places';
import Reveal from '@/components/home/Reveal';
import CountUp from '@/components/home/CountUp';
import { getAnnouncements, upcoming } from '@/lib/announcements';
import { getGallery, getMasterclassPhotos, nowKyivLocal } from '@/lib/content';
import { AUTUMN_CAMP, PARTIES, isCampActive, withEvents } from '@/lib/events';
import { currentSeason } from '@/lib/season';
import Bats from '@/components/season/Bats';
import {
  AGE_GROUPS, ALL_INCLUSIVE, FAQ, GROUP_SIZE_MAX, MASTER_CLASSES, PRICES, STUDIO, TRIAL_PRICE,
  lessonsByAge,
} from '@/lib/data';
import './home.css';

/* Анонсы и галерея ведутся в админке: страница обновляется не реже раза в минуту,
   а после сохранения в админке — сразу (revalidateTag). */
export const revalidate = 60;

/* Места прищепок на верёвке: x в % ширины и сдвиг вниз в px — по провисанию верёвки. */
const PINS = [
  { left: 3, top: 50, color: 'var(--brand-orange)' },
  { left: 19.5, top: 66, color: 'var(--accent-teal)' },
  { left: 36, top: 74, color: 'var(--accent-pink)' },
  { left: 52.5, top: 72, color: 'var(--accent-yellow)' },
  { left: 69, top: 60, color: 'var(--plush)' },
];

const CONFETTI = [
  { x: '4%', y: '8%', s: 14, c: 'var(--accent-teal)', dx: '30px', dy: '40px' },
  { x: '92%', y: '6%', s: 18, c: 'var(--accent-pink)', dx: '-40px', dy: '30px' },
  { x: '48%', y: '2%', s: 10, c: 'var(--accent-yellow)', dx: '20px', dy: '50px' },
  { x: '86%', y: '44%', s: 22, c: 'var(--accent-yellow)', dx: '-30px', dy: '-40px' },
  { x: '2%', y: '52%', s: 16, c: 'var(--brand-orange)', dx: '40px', dy: '-20px' },
  { x: '60%', y: '40%', s: 12, c: 'var(--accent-cyan)', dx: '-20px', dy: '30px' },
];

const CONFETTI_HALLOWEEN = ['#F26F21', '#7A4FD1', '#3DAA5C', '#F26F21', '#2B1A4F', '#FBD668'];


export default async function HomePage() {
  const now = nowKyivLocal();
  const halloween = currentSeason() === 'halloween';
  const campOn = isCampActive(AUTUMN_CAMP, now);
  const partiesOn = halloween && now <= PARTIES.until;
  const [events, works, mkPhotos] = await Promise.all([
    getAnnouncements().then((list) => upcoming(withEvents(list, now), now).slice(0, 3)),
    getGallery({ onlyHome: true, limit: 5 }),
    getMasterclassPhotos(),
  ]);

  const mkShowcase = MASTER_CLASSES.filter((m) => mkPhotos[m.slug] && m.kids).slice(0, 3);
  const faq = FAQ.filter((f) => /віку|пробне|пропустила/.test(f.q)).slice(0, 3);

  return (
    <>
      {/* ---------- первый экран ---------- */}
      <section className="lp-hero">
        <Reveal />
        <div className="lp-confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <i key={i} style={{ left: c.x, top: c.y, width: c.s, height: c.s, background: halloween ? CONFETTI_HALLOWEEN[i] : c.c, animationDelay: `${-i * 1.3}s`, ['--dx' as string]: c.dx, ['--dy' as string]: c.dy }} />
          ))}
        </div>
        {halloween && <Bats />}
        <Plush halloween={halloween} />

        <div className="wrap">
          <div className="lp-hero-row">
            <div className="lp-hero-text">
              <span className="lp-pill"><i aria-hidden="true" />Арт-студія та школа розвитку в Кременчуці</span>
              <h1 className="t-display">
                Творчість, яку дитина <span className="lp-blob">несе</span> додому
              </h1>
              <p className="t-lead">
                Малювання, ліплення, робототехніка, англійська та підготовка до школи.
                Групи до {GROUP_SIZE_MAX} дітей, від 3 років, дві локації: Раківка і Молодіжний.
              </p>
            </div>
            <div className="lp-hero-cta">
              <Link className="btn" href="/zapys">Пробне заняття за {TRIAL_PRICE} ₴</Link>
              <Link className="btn btn--ghost" href="/pidbir">Підібрати напрям за 30 секунд</Link>
            </div>
          </div>
        </div>

        <div className="lp-garland">
          <span className="t-hand lp-garland-note">кожна робота йде додому того ж дня ↘</span>
          <svg className="lp-rope" viewBox="0 0 1360 90" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 Q 680 100 1360 10" />
          </svg>
          <div className="lp-pins">
            {works.slice(0, PINS.length).map((w, i) => (
              <figure
                key={w.src}
                className="lp-card"
                style={{ left: `${PINS[i].left}%`, top: PINS[i].top, animationDelay: `${700 + i * 120}ms, 1.4s` }}
              >
                <span className="lp-card-pin" style={{ background: PINS[i].color }} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.src} alt={w.alt} loading="eager" />
                {w.caption && <figcaption>{w.caption}</figcaption>}
              </figure>
            ))}
          </div>
          <div className="lp-capy">
            <span className="lp-capy-say">{halloween ? 'бу! я Капі' : 'привіт! я Капі'}</span>
            <Capy size={190} hat={halloween} />
          </div>
        </div>

        <div className="wrap">
          <div className="lp-stats">
            <div><b><CountUp prefix="до " to={GROUP_SIZE_MAX} /></b><span className="lp-stat-l">дітей у групі</span></div>
            <div><b>3+</b><span className="lp-stat-l">років, перша група</span></div>
            <div><b><CountUp to={2} /></b><span className="lp-stat-l">локації в Кременчуці</span></div>
            <div><b><CountUp to={MASTER_CLASSES.length} /></b><span className="lp-stat-l">майстер-класів дітям і дорослим</span></div>
          </div>
        </div>
      </section>

      <div className="lp-tapes" aria-hidden="true">
        <div className="lp-marquee">
          <div className="lp-marquee-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: 'flex', gap: 40 }}>
                <span>малювання ✦</span><span>ліплення ✦</span><span>робототехніка ✦</span>
                <span>англійська ✦</span><span>підготовка до школи ✦</span><span>сенсорика ✦</span>
              </span>
            ))}
          </div>
        </div>
        <div className="lp-marquee lp-marquee--plum">
          <div className="lp-marquee-track">
            {[0, 1].map((k) => (
              <span key={k} style={{ display: 'flex', gap: 40 }}>
                {halloween ? (
                  <>
                    <span>осінній табір 🎃</span><span>лазертаг ✦</span><span>страшні експерименти 🧪</span>
                    <span>кінодень ✦</span><span>halloween-вечірка 🦇</span><span>грим і маски ✦</span>
                  </>
                ) : (
                  <>
                    <span>майстер-класи ✦</span><span>дні народження ✦</span><span>табори ✦</span>
                    <span>кіновечірки ✦</span><span>сертифікати ✦</span><span>свята ✦</span>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- табір (пока идёт запись) ---------- */}
      {campOn && (
        <section className="lp-sec lp-camp-sec">
          <div className="wrap">
            <Link href={`/anonsy/${AUTUMN_CAMP.slug}`} className="lp-camp" data-reveal>
              <span className="lp-camp-moon" aria-hidden="true" />
              <div className="lp-camp-text">
                <span className="lp-camp-dates">{AUTUMN_CAMP.dates}</span>
                <h2 className="lp-camp-title">Осінній <em>страшний</em> табір</h2>
                <p>{AUTUMN_CAMP.subtitle}</p>
                <ul className="lp-camp-days">
                  {AUTUMN_CAMP.days.map((d) => (
                    <li key={d.n}><b>{d.date.split(', ')[0]}</b>{d.title}</li>
                  ))}
                </ul>
                <span className="btn lp-camp-btn">Програма і запис</span>
              </div>
              <div className="lp-camp-posters" aria-hidden="true">
                {[AUTUMN_CAMP.days[0].poster, AUTUMN_CAMP.poster, AUTUMN_CAMP.days[4].poster].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" loading="lazy" className={`lp-camp-p lp-camp-p--${i}`} />
                ))}
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ---------- Halloween-вечірки под заказ ---------- */}
      {partiesOn && (
        <section className="lp-sec lp-parties-sec">
          <div className="wrap">
            <div className="lp-head" data-reveal>
              <h2 className="t-h2">Halloween-вечірка для вашої компанії</h2>
              <Link className="lp-more" href={`/anonsy/${PARTIES.slug}`}>Усі програми</Link>
            </div>
            <p className="t-lead" data-reveal style={{ marginTop: 12 }}>
              Для класу, друзів чи групи. У нашій студії або на вашій локації: оберіть історію, а атмосферу ми створимо самі.
            </p>
          </div>
          <div className="lp-parties" data-reveal>
            {PARTIES.themes.map((t, i) => (
              <Link key={t.id} href={`/anonsy/${PARTIES.slug}#tematyky`} className="lp-party" style={{ ['--tone' as string]: t.tone, ['--tilt' as string]: `${i % 2 ? 1.5 : -1.5}deg` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.poster} alt="" loading="lazy" />
                <span>{t.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- анонсы ---------- */}
      <section className="lp-sec" id="anonsy">
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Що буде найближчим часом</h2>
            <Link className="lp-more" href="/anonsy">Усі події</Link>
          </div>

          {events.length > 0 ? (
            <div className="lp-events">
              {events.map((a, i) => <EventCard key={a.id} a={a} i={i} />)}
            </div>
          ) : (
            <div className="lp-events-empty" data-reveal>
              <p>
                Нові вечірки, табори й майстер-класи ми анонсуємо спершу в Instagram.
                Підпишіться, щоб не пропустити запис.
              </p>
              <a className="btn btn--ghost" href={STUDIO.instagram} target="_blank" rel="noopener"
                 style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none' }}>
                Instagram студії
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ---------- направления ---------- */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Чотири світи. З якого почнемо?</h2>
            <Link className="t-hand" href="/pidbir" style={{ textDecoration: 'none' }}>не знаєте? квіз підкаже ↗</Link>
          </div>

          <div className="lp-bento">
            <Link href="/zapys" className="lp-tile lp-tile--photo" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mkPhotos['liplennya-plastylin'] ?? '/photos/mk/liplennya.jpg'} alt="" loading="lazy" />
              <span className="lp-age">3–8 років</span>
              <h3>Творчість</h3>
              <p>малювання, ліплення, сенсорика</p>
            </Link>
            <Link href="/zapys" className="lp-tile lp-tile--plum" data-reveal>
              <span className="lp-age">5–8 років</span>
              <h3>Технології</h3>
              <p>робототехніка, логіка, перші програми</p>
              <span className="lp-tile-deco" style={{ background: 'rgba(79,209,217,.35)' }} aria-hidden="true" />
            </Link>
            <Link href="/zapys" className="lp-tile lp-tile--yellow" data-reveal>
              <span className="lp-tile-deco" aria-hidden="true" />
              <span className="lp-age">3–6 років</span>
              <h3>Розвиток</h3>
              <p>ранній розвиток і підготовка до школи</p>
            </Link>
            <Link href="/zapys" className="lp-tile lp-tile--teal" data-reveal>
              <span className="lp-tile-deco" aria-hidden="true" />
              <span className="lp-age">7+ років</span>
              <h3>Комунікація</h3>
              <p>англійська та репетиторство</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- возрастные группы ---------- */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Росте дитина, росте й група</h2>
            <p className="t-lead" style={{ margin: 0, maxWidth: 440 }}>
              У кожного віку свій набір занять і своя тривалість. Від {PRICES.std.single} ₴ за заняття, матеріали входять.
            </p>
          </div>
          <div className="lp-steps">
            {AGE_GROUPS.map((g) => {
              const lessons = lessonsByAge(g.id);
              return (
                <Link key={g.id} href={`/zapys?age=${g.id}`} className="lp-step">
                  <em>{lessons[0]?.dur ?? 60} хв</em>
                  <div>
                    <b>{g.title}</b>
                    <span>{g.note}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- All Inclusive ---------- */}
      <section className="lp-ai">
        <div className="wrap">
          <div className="lp-ai-inner">
            <div className="lp-ai-text" data-reveal="left">
              <span className="lp-kicker">Абонемент All Inclusive</span>
              <div className="lp-ai-price"><CountUp to={ALL_INCLUSIVE.price} suffix=" ₴" ms={1400} /></div>
              <span className="t-hand">на місяць, і ніяких «а ще доплатіть»</span>
              <p>{ALL_INCLUSIVE.description}.</p>
              <Link className="btn btn--yellow" href="/rozklad">Розклад і що входить</Link>
            </div>
            <div className="lp-ai-photos" aria-hidden="true" data-reveal="pop">
              {[
                mkPhotos['holst-pidramnyk'] ?? '/photos/mk/holst.jpg',
                mkPhotos['rozpys-pryanykiv'] ?? '/photos/mk/pryanyky.jpg',
                mkPhotos['robototehnika-mk'] ?? '/photos/mk/robototehnika.jpg',
                mkPhotos['neonove-malyuvannya'] ?? '/photos/mk/neon.jpg',
              ].map((src) => (
                <div key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- свята и мастер-классы ---------- */}
      <section className="lp-sec">
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Крім занять</h2>
          </div>
          <div className="lp-duo">
            <Link href="/den-narodzhennya" className="lp-promo lp-promo--bd" data-reveal>
              <span className="t-hand" style={{ color: 'var(--accent-yellow)' }}>день народження в TVORCHI</span>
              <h3>Свято, після якого не хочуть додому</h3>
              <p>Квест, майстер-клас, фотозона й частування. До 15 дітей, кожен забирає свою роботу. Від 2000 ₴.</p>
              <span className="btn btn--yellow">Зібрати свято</span>
              <span className="lp-promo-capy" aria-hidden="true"><Capy size={190} mood="wink" hat={halloween} /></span>
            </Link>

            <Link href="/maister-klasy" className="lp-promo lp-promo--mk" data-reveal style={{ ['--rv-delay' as string]: '.12s' }}>
              <h3>Майстер-класи на один раз</h3>
              <p>Для дітей і дорослих, компанією або вдвох. Усі матеріали включено.</p>
              {mkShowcase.length > 0 && (
                <div className="lp-mk-strip">
                  {mkShowcase.map((m) => (
                    <figure key={m.slug}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mkPhotos[m.slug]} alt="" loading="lazy" />
                      <figcaption>
                        {m.title}
                        <span>{m.kids!.from ? 'від ' : ''}{m.kids!.price} ₴</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <span className="btn">Обрати майстер-клас</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- где мы ---------- */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Дві студії в Кременчуці</h2>
          </div>
          <Places />
        </div>
      </section>

      {/* ---------- вопросы ---------- */}
      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lp-head">
            <h2 className="t-h2">Що зазвичай питають</h2>
            <Link className="lp-more" href="/faq">Усі питання</Link>
          </div>
          <div className="lp-faq" data-reveal>
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- финальный призыв ---------- */}
      <section className="lp-sec--tight">
        <div className="wrap">
          <div className="lp-final" data-reveal="pop">
            <span className="lp-final-capy" aria-hidden="true"><Capy size={170} hat={halloween} /></span>
            <h2 className="t-h2">Приходьте на пробне заняття. Це {TRIAL_PRICE} ₴ і година творчості.</h2>
            <Link className="btn" href="/zapys">Записатися</Link>
          </div>
        </div>
      </section>
    </>
  );
}
