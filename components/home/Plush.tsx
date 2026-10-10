'use client';

import { useEffect, useRef } from 'react';

/* «Плюшевое» TVORCHI — как пушистые синие буквы на стене студии,
   на фоне трёх пастельных волн оттуда же.

   Каждая буква — отдельный маленький SVG с «меховым» фильтром.
   Двигаем не сам SVG, а обёртки-спаны CSS-трансформациями: браузер
   один раз рисует мех и дальше просто двигает готовую картинку на GPU.
   Иначе фильтр пересчитывался бы каждый кадр и телефон бы грелся.

   Слои движения (каждый на своей обёртке, чтобы трансформации не спорили):
   .pl-l     — появление: буква «плюхается» на стену (один раз)
   .pl-lean  — наклон к курсору
   .pl-wob   — постоянное покачивание, у каждой буквы свой ритм
   .pl-boing — «желе» при наведении, тапе и время от времени само по себе */

const PAD = 16; // запас по бокам под ворс
const LETTERS = [
  { ch: 'T', w: 182, dx: -4 },
  { ch: 'V', w: 200, dx: 0 },
  { ch: 'O', w: 218, dx: 0 },
  { ch: 'R', w: 191, dx: 0 },
  { ch: 'C', w: 186, dx: 0 },
  { ch: 'H', w: 212, dx: 0 },
  { ch: 'I', w: 84, dx: 0 },
];
const TOTAL = LETTERS.reduce((s, l) => s + l.w, 0) + PAD * 2;

/* В сезон Halloween буква «O» становится тыквой-фонарём:
   дырку буквы заливаем, сверху хвостик, на «лице» вырезанные глаза и улыбка. */
function Pumpkin({ cx }: { cx: number }) {
  return (
    <g className="pl-pumpkin">
      <ellipse cx={cx} cy={146} rx={72} ry={74} fill="#F26F21" filter="url(#plushFur)" />
      <path d={`M${cx - 4} 58 C ${cx - 6} 40, ${cx + 2} 26, ${cx + 16} 20 L ${cx + 20} 30 C ${cx + 10} 36, ${cx + 8} 46, ${cx + 10} 60 Z`} fill="#3DAA5C" />
      <g className="pl-face" fill="#2B1A4F">
        <path d={`M${cx - 52} 128 L ${cx - 22} 104 L ${cx - 14} 140 Z`} />
        <path d={`M${cx + 52} 128 L ${cx + 22} 104 L ${cx + 14} 140 Z`} />
        <path d={`M${cx - 6} 152 L ${cx} 140 L ${cx + 6} 152 Z`} />
        <path d={`M${cx - 62} 168 Q ${cx} 222 ${cx + 62} 168 L ${cx + 44} 178 L ${cx + 30} 166 L ${cx + 14} 182 L ${cx} 168 L ${cx - 14} 182 L ${cx - 30} 166 L ${cx - 44} 178 Z`} />
      </g>
    </g>
  );
}

export default function Plush({ halloween = false }: { halloween?: boolean }) {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const letters = Array.from(word.querySelectorAll<HTMLElement>('.pl-l'));
    const boings = letters.map((l) => l.querySelector<HTMLElement>('.pl-boing')!);
    const leans = letters.map((l) => l.querySelector<HTMLElement>('.pl-lean')!);

    const boing = (i: number) => {
      const el = boings[i];
      if (!el || el.classList.contains('is-boing')) return;
      el.classList.add('is-boing');
      el.addEventListener('animationend', () => el.classList.remove('is-boing'), { once: true });
    };

    // наведение и тап — буква пружинит
    const handlers = letters.map((l, i) => {
      const h = () => boing(i);
      l.addEventListener('pointerenter', h);
      l.addEventListener('click', h);
      return h;
    });
    const unbind = () =>
      letters.forEach((l, i) => {
        l.removeEventListener('pointerenter', handlers[i]);
        l.removeEventListener('click', handlers[i]);
      });

    if (reduce) return unbind;

    // сами по себе: каждые пару секунд «оживает» случайная буква
    const timer = window.setInterval(() => boing(Math.floor(Math.random() * letters.length)), 2200);

    // наклон к курсору: буквы тянутся в сторону указателя
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        letters.forEach((l, i) => {
          const r = l.getBoundingClientRect();
          const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 500));
          const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 400));
          leans[i].style.transform = `translate(${dx * 10}px, ${dy * 8}px) rotate(${dx * 7}deg)`;
        });
      });
    };
    const onLeave = () => leans.forEach((el) => (el.style.transform = ''));
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      unbind();
    };
  }, []);

  return (
    <div className={`plush${halloween ? ' plush--halloween' : ''}`}>
      <svg className="plush-waves" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80 C 180 20, 360 140, 540 80 S 900 20, 1080 80 S 1360 140, 1440 70" />
        <path d="M0 140 C 200 80, 380 200, 560 140 S 920 80, 1100 140 S 1380 200, 1440 130" />
        <path d="M0 200 C 220 150, 400 250, 600 200 S 940 150, 1120 200 S 1380 250, 1440 190" />
      </svg>

      {/* общий «мех» для всех букв */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="plushFur" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="9" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2 1" result="spots" />
            <feComposite in="spots" in2="d" operator="in" result="sp" />
            <feMerge>
              <feMergeNode in="d" />
              <feMergeNode in="sp" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="plush-word" ref={wordRef} role="img" aria-label="TVORCHI">
        {LETTERS.map((l, i) => {
          const box = l.w + PAD * 2;
          return (
            <span
              key={l.ch}
              className="pl-l"
              aria-hidden="true"
              style={{
                width: `${(box / TOTAL) * 100}%`,
                marginLeft: i === 0 ? 0 : `${((-PAD * 2) / TOTAL) * 100}%`,
                animationDelay: `${120 + i * 90}ms`,
                ['--wob' as string]: `${2.4 + (i % 3) * 0.45}s`,
                ['--wob-delay' as string]: `${-i * 0.37}s`,
              }}
            >
              <span className="pl-lean">
                <span className="pl-wob">
                  <span className="pl-boing">
                    <svg viewBox={`0 0 ${box} 300`} aria-hidden="true" overflow="visible">
                      <text
                        className={`plush-glyph${halloween && l.ch === 'O' ? ' plush-glyph--pumpkin' : ''}`}
                        x={box / 2 + l.dx}
                        y="240"
                        textAnchor="middle"
                        filter="url(#plushFur)"
                      >
                        {l.ch}
                      </text>
                      {halloween && l.ch === 'O' && <Pumpkin cx={box / 2} />}
                    </svg>
                  </span>
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
