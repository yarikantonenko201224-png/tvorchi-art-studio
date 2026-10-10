'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LESSONS, MOLODIZHNY, DAY_FULL, AGE_GROUPS, type DayId, type AgeId } from '@/lib/data';

/* Тижневий розклад: вкладки локацій і фільтр за віком.
   Кожне заняття — кольорова картка напряму, клік веде на запис з цим віком. */

const DAYS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const DIR_COLORS: [RegExp, string, string][] = [
  [/малюв/i, '#FFE0CC', '#F26F21'],
  [/ліпл/i, '#FFE0EE', '#F73FA6'],
  [/робот/i, '#DFEAFF', '#2F63D8'],
  [/англ/i, '#D9F4EC', '#1FA38A'],
  [/школ/i, '#FFF1BF', '#C99300'],
  [/сенсор|ранній/i, '#ECE4FF', '#7A4FD1'],
  [/репетит/i, '#E8EEF2', '#4A6070'],
];
function tone(dir: string) {
  const hit = DIR_COLORS.find(([re]) => re.test(dir));
  return hit ? { bg: hit[1], acc: hit[2] } : { bg: '#F4EEE6', acc: '#1B1230' };
}

export default function ScheduleClient() {
  const [place, setPlace] = useState<'r' | 'm'>('r');
  const [age, setAge] = useState<AgeId | 'all'>('all');

  const items = place === 'r'
    ? LESSONS.filter((l) => age === 'all' || l.age === age).map((l) => ({
        id: l.id, day: l.day, time: l.time, dir: l.dir, sub: `${l.age} років · ${l.dur} хв`, href: `/zapys?age=${l.age}`,
      }))
    : MOLODIZHNY.map((l) => ({
        id: l.id, day: l.day, time: l.time, dir: l.dir, sub: l.group ? `${l.group} група` : 'група за віком', href: '/zapys',
      }));
  const days = DAYS.filter((d) => items.some((i) => i.day === d));

  return (
    <div className="sc">
      <div className="sc-tools">
        <div className="sc-tabs" role="tablist" aria-label="Локація">
          <button role="tab" aria-selected={place === 'r'} onClick={() => setPlace('r')}>Раківка</button>
          <button role="tab" aria-selected={place === 'm'} onClick={() => setPlace('m')}>Молодіжний</button>
          <span className="sc-tabs-pill" style={{ transform: `translateX(${place === 'r' ? 0 : 100}%)` }} aria-hidden="true" />
        </div>
        {place === 'r' ? (
          <div className="chips" role="group" aria-label="Вік">
            <button className="chip" aria-pressed={age === 'all'} onClick={() => setAge('all')}>Усі віки</button>
            {AGE_GROUPS.map((g) => (
              <button key={g.id} className="chip" aria-pressed={age === g.id} onClick={() => setAge(g.id)}>{g.title} р.</button>
            ))}
          </div>
        ) : (
          <p className="t-small">вул. Лесі Українки, 37А · вік груп уточнюйте за телефоном</p>
        )}
      </div>

      <div className="sc-week" key={`${place}-${age}`}>
        {days.map((d, di) => (
          <section key={d} className="sc-day" style={{ ['--i' as string]: di }}>
            <h3>{DAY_FULL[d]}</h3>
            {items.filter((i) => i.day === d).map((l) => {
              const t = tone(l.dir);
              return (
                <Link key={l.id} href={l.href} className="sc-lesson" style={{ background: t.bg, ['--acc' as string]: t.acc }}>
                  <span className="sc-time">{l.time}</span>
                  <b>{l.dir}</b>
                  <small>{l.sub}</small>
                </Link>
              );
            })}
          </section>
        ))}
        {!days.length && <p className="t-lead">Для цього віку на цій локації занять поки немає.</p>}
      </div>
    </div>
  );
}
