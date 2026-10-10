'use client';

import { useEffect, useRef, useState } from 'react';

/* Вертикальное видео в рамке телефона. Играет без звука, только пока видно
   на экране (бережём батарею и трафик); звук включается кнопкой. */
export default function PhoneVideo({ src, webm, poster, label }: { src: string; webm?: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <div className="pvid">
      <video ref={ref} poster={poster} muted loop playsInline preload="metadata" aria-label={label}>
        <source src={src} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
      </video>
      <button type="button" className="pvid-sound" onClick={toggle} aria-pressed={!muted}>
        {muted ? '🔇 Увімкнути звук' : '🔊 Вимкнути звук'}
      </button>
    </div>
  );
}
