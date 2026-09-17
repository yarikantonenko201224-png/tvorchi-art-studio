'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AGE_GROUPS, PRICES, DAY_SHORT, TRIAL_PRICE,
  LIKE_LABELS, DEVELOP_LABELS, LIKE_PHRASES, DEVELOP_PHRASES,
  matchDirections, lessonsByAge,
  type AgeId, type LikeTag, type DevelopTag,
} from '@/lib/data';
import { lessonsWord } from '@/lib/format';

/* Подбор занятия за три вопроса.

   Ответы живут в URL, а не в состоянии: результат можно переслать
   в Direct, а во встроенном браузере Instagram localStorage
   может обнуляться между переходами. */

const MAX_DEVELOPS = 2;

export default function Quiz() {
  const router = useRouter();
  const params = useSearchParams();

  const urlAge = params.get('a') as AgeId | null;
  const urlLikes = (params.get('l') || '').split(',').filter(Boolean) as LikeTag[];
  const urlDevelops = (params.get('d') || '').split(',').filter(Boolean) as DevelopTag[];

  const [age, setAge] = useState<AgeId | null>(urlAge);
  const [likes, setLikes] = useState<LikeTag[]>(urlLikes);
  const [develops, setDevelops] = useState<DevelopTag[]>(urlDevelops);
  const [step, setStep] = useState<number>(urlAge && urlDevelops.length ? 3 : 0);

  function sync(next: { a?: AgeId | null; l?: LikeTag[]; d?: DevelopTag[] }) {
    const a = next.a !== undefined ? next.a : age;
    const l = next.l !== undefined ? next.l : likes;
    const d = next.d !== undefined ? next.d : develops;
    const q = new URLSearchParams();
    if (a) q.set('a', a);
    if (l.length) q.set('l', l.join(','));
    if (d.length) q.set('d', d.join(','));
    router.replace(`/pidbir?${q.toString()}`, { scroll: false });
  }

  function toggleLike(t: LikeTag) {
    const next = likes.includes(t) ? likes.filter((x) => x !== t) : [...likes, t];
    setLikes(next);
    sync({ l: next });
  }

  function toggleDevelop(t: DevelopTag) {
    let next: DevelopTag[];
    if (develops.includes(t)) next = develops.filter((x) => x !== t);
    else if (develops.length >= MAX_DEVELOPS) next = [...develops.slice(1), t];
    else next = [...develops, t];
    setDevelops(next);
    sync({ d: next });
  }

  const progress = ((step + 1) / 4) * 100;

  /* ---------------- ШАГ 1: возраст ---------------- */
  if (step === 0) {
    return (
      <Shell progress={progress} onBack={null} step="1 / 3">
        <h1 className="t-h1" style={{ marginTop: 20 }}>Скільки років дитині?</h1>
        <p className="t-lead">Від віку залежить, які напрями взагалі доступні.</p>

        <div className="grid-2">
          {AGE_GROUPS.map((g) => (
            <button
              key={g.id}
              className="tile"
              style={{ minHeight: 104 }}
              onClick={() => {
                setAge(g.id);
                sync({ a: g.id });
                setStep(1);
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 27, lineHeight: 1, letterSpacing: '-1px' }}>
                {g.title}
              </span>
              <span className="d">{lessonsByAge(g.id).length} {lessonsWord(lessonsByAge(g.id).length)} на тиждень</span>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  /* ---------------- ШАГ 2: что нравится ---------------- */
  if (step === 1) {
    return (
      <Shell progress={progress} onBack={() => setStep(0)} step="2 / 3">
        <h1 className="t-h1" style={{ marginTop: 20 }}>Що подобається дитині?</h1>
        <p className="t-lead">Можна обрати кілька — або жодного, якщо ще не знаєте.</p>

        <div style={{ marginTop: 18 }}>
          {(Object.keys(LIKE_LABELS) as LikeTag[]).map((t) => (
            <button
              key={t}
              type="button"
              className="option-row"
              aria-pressed={likes.includes(t)}
              onClick={() => toggleLike(t)}
            >
              <span>{LIKE_LABELS[t]}</span>
              <span className="pick-mark" aria-hidden="true" />
            </button>
          ))}
        </div>

        <button className="btn btn--wide" style={{ marginTop: 18 }} onClick={() => setStep(2)}>
          Далі
        </button>
      </Shell>
    );
  }

  /* ---------------- ШАГ 3: что развивать ---------------- */
  if (step === 2) {
    return (
      <Shell progress={progress} onBack={() => setStep(1)} step="3 / 3">
        <h1 className="t-h1" style={{ marginTop: 20 }}>Що хочете розвивати?</h1>
        <p className="t-lead">Оберіть до двох — так підбір буде точнішим.</p>

        <div style={{ marginTop: 18 }}>
          {(Object.keys(DEVELOP_LABELS) as DevelopTag[]).map((t) => (
            <button
              key={t}
              type="button"
              className="option-row"
              aria-pressed={develops.includes(t)}
              onClick={() => toggleDevelop(t)}
            >
              <span>{DEVELOP_LABELS[t]}</span>
              <span className="pick-mark" aria-hidden="true" />
            </button>
          ))}
        </div>

        <button className="btn btn--wide" style={{ marginTop: 18 }} onClick={() => setStep(3)}>
          Показати результат
        </button>
      </Shell>
    );
  }

  /* ---------------- РЕЗУЛЬТАТ ---------------- */
  const chosenAge = (age ?? '5-6') as AgeId;
  const all = matchDirections(chosenAge, likes, develops);
  const scored = all.filter((m) => m.score > 0);
  /* Если совпадений нет — не выдумываем «рекомендации», показываем всё,
     что доступно в этом возрасте, и говорим об этом прямо. */
  const results = (scored.length ? scored : all).slice(0, 3);
  const group = AGE_GROUPS.find((g) => g.id === chosenAge)!;
  const fewOptions = all.length <= 2;

  return (
    <Shell progress={100} onBack={() => setStep(2)} step="Готово">
      <h1 className="t-h1" style={{ marginTop: 20 }}>
        {scored.length ? 'Ось що ми рекомендуємо' : `Що є для ${group.title} років`}
      </h1>
      <p className="t-lead">
        {scored.length
          ? `Для дитини ${group.title} років, з урахуванням ваших відповідей.`
          : `У цьому віці вибір невеликий — показуємо всі доступні напрями.`}
      </p>

      {results.map((m) => {
        const price = PRICES[m.lessons[0].tier];
        const reasons: string[] = [];
        if (m.matchedLikes.length) {
          reasons.push(`дитина любить ${m.matchedLikes.map((t) => LIKE_PHRASES[t]).join(' і ')}`);
        }
        if (m.matchedDevelops.length) {
          reasons.push(`ви хочете розвивати ${m.matchedDevelops.map((t) => DEVELOP_PHRASES[t]).join(' і ')}`);
        }

        return (
          <div className="card" key={m.dir}>
            <div className="card-head">
              <div className="t-h3">{m.dir}</div>
              <span className="badge">{m.lessons[0].dur} хв</span>
            </div>

            {reasons.length > 0 && (
              <p className="t-small" style={{ marginTop: 10, color: 'var(--ink-700)' }}>
                Рекомендуємо, бо {reasons.join(', а ')}.
              </p>
            )}

            <p className="t-small" style={{ marginTop: 10 }}>
              {m.lessons.map((l) => `${DAY_SHORT[l.day]} ${l.time}`).join(' · ')} · {m.lessons[0].place}
            </p>

            <div className="card-foot">
              <span className="t-small">
                <span className="t-price" style={{ color: 'var(--ink-900)' }}>{price.single} ₴</span>{' '}
                разове · абонемент від {price.pack4} ₴
              </span>
              <Link className="btn btn--small" href="/zapys" style={{ display: 'grid', placeItems: 'center' }}>
                Записатися
              </Link>
            </div>
          </div>
        );
      })}

      {fewOptions && (
        <div className="note">
          Для цього віку регулярних груп поки небагато. Подивіться також{' '}
          <Link href="/maister-klasy" style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            майстер-класи
          </Link>{' '}
          та{' '}
          <Link href="/den-narodzhennya" style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>
            дні народження
          </Link>.
        </div>
      )}

      <button
        className="btn btn--ghost btn--wide"
        style={{ marginTop: 16 }}
        onClick={() => {
          setAge(null); setLikes([]); setDevelops([]); setStep(0);
          router.replace('/pidbir', { scroll: false });
        }}
      >
        Пройти ще раз
      </button>

      <p className="t-small" style={{ marginTop: 16, textAlign: 'center' }}>
        Посилання на цей результат можна надіслати — усі відповіді збережені в адресі сторінки.
      </p>
    </Shell>
  );
}

/* ---------------- обёртка со степпером и липкой кнопкой ---------------- */
function Shell({
  children, progress, onBack, step,
}: {
  children: React.ReactNode;
  progress: number;
  onBack: (() => void) | null;
  step: string;
}) {
  return (
    <>
      <div className="page">
        <div className="topbar">
          {onBack ? (
            <button className="icon-btn" onClick={onBack} aria-label="Назад">←</button>
          ) : (
            <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
          )}
          <span className="t-small">{step}</span>
        </div>

        <div style={{ height: 3, background: 'var(--border-subtle)', borderRadius: 2, marginTop: 14 }}>
          <div
            style={{
              width: `${progress}%`, height: '100%', borderRadius: 2,
              background: 'var(--brand-orange)', transition: 'width .3s ease',
            }}
          />
        </div>

        {children}
      </div>

      <div className="bar">
        <div className="bar-info">
          <div className="k">Пробне заняття</div>
          <div className="v">{TRIAL_PRICE} ₴</div>
        </div>
        <Link className="btn" href="/zapys" style={{ display: 'grid', placeItems: 'center' }}>
          Записатися
        </Link>
      </div>
    </>
  );
}
