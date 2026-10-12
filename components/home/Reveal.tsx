'use client';

import { useEffect } from 'react';

/* Включает «приклеивание» блоков при прокрутке.
   Элементы с data-reveal (и .lp-steps) получают .is-in, когда появляются в окне.
   Класс js-rv на <html> ставится только здесь: без JS всё видно сразу. */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], .lp-steps');

    /* То, что уже видно на экране при загрузке, не прячем и не анимируем:
       иначе блоки на долю секунды показываются, исчезают и выезжают снова. */
    const vh = window.innerHeight;
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) t.classList.add('is-in', 'rv-now');
    });
    root.classList.add('js-rv');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));

    return () => {
      io.disconnect();
      root.classList.remove('js-rv');
    };
  }, []);

  return null;
}
