'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SceneObject, type ObjectId } from './SceneObjects';
import { CLUSTERS } from '@/lib/data';

/* Первый экран.

   Сцена: предметы студии разлетаются из центра и складываются вокруг кляксы —
   «фарба бризнула і склалася в знак». На мобильном это разовая анимация
   при загрузке (~900 мс), после неё экран статичен и сразу рабочий:
   человек из Instagram не должен ждать, пока что-то доиграет.
   Бесконечный дрейф включается только на широких экранах — на телефоне
   он съедает батарею и ничего не добавляет. */

type SceneItem = {
  id: ObjectId;
  left: number;   // % контейнера
  top: number;    // % контейнера
  size: number;   // px
  rot: number;    // конечный поворот
  dx: number;     // откуда прилетает
  dy: number;
};

const ITEMS: SceneItem[] = [
  { id: 'spool',    left: 50, top: 7,  size: 32, rot: 8,   dx: 0,    dy: -120 },
  { id: 'brush',    left: 15, top: 20, size: 44, rot: -18, dx: -110, dy: -80 },
  { id: 'pencil',   left: 85, top: 17, size: 40, rot: 22,  dx: 110,  dy: -85 },
  { id: 'paper',    left: 9,  top: 47, size: 36, rot: -14, dx: -130, dy: 0 },
  { id: 'bubble',   left: 91, top: 42, size: 40, rot: 12,  dx: 130,  dy: -10 },
  { id: 'brick',    left: 13, top: 76, size: 42, rot: -8,  dx: -115, dy: 85 },
  { id: 'gear',     left: 88, top: 73, size: 38, rot: 14,  dx: 120,  dy: 80 },
  { id: 'scissors', left: 31, top: 90, size: 38, rot: 10,  dx: -70,  dy: 120 },
  { id: 'drop',     left: 68, top: 92, size: 32, rot: -12, dx: 75,   dy: 125 },
];

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [openCluster, setOpenCluster] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const active = CLUSTERS.find((c) => c.id === openCluster) ?? null;

  return (
    <section>
      <div className={`scene${ready ? ' is-ready' : ''}`} aria-hidden="true">
        {ITEMS.map((it, i) => (
          <span
            key={it.id}
            className="scene-obj"
            style={
              {
                left: `${it.left}%`,
                top: `${it.top}%`,
                width: it.size,
                height: it.size,
                transitionDelay: `${i * 45}ms`,
                ['--dx' as string]: `${it.dx}px`,
                ['--dy' as string]: `${it.dy}px`,
                ['--rot' as string]: `${it.rot}deg`,
              } as React.CSSProperties
            }
          >
            <span className="scene-obj-inner" style={{ animationDelay: `${i * 380}ms` }}>
              <SceneObject id={it.id} />
            </span>
          </span>
        ))}

        <span className="scene-logo">
          <Logo href={null} variant="stamp" height={132} />
        </span>
      </div>

      <h1 className="t-display" style={{ marginTop: 4 }}>
        Знайдіть заняття для своєї дитини
      </h1>
      <p className="t-lead">
        Малювання, ліплення, робототехніка, англійська та підготовка до школи.
        Дві локації в Кременчуці, від 3 років.
      </p>

      <div className="grid-2" role="group" aria-label="Напрямки">
        {CLUSTERS.map((c) => {
          const isOpen = openCluster === c.id;
          return (
            <button
              key={c.id}
              className="tile cluster"
              aria-expanded={isOpen}
              onClick={() => setOpenCluster(isOpen ? null : c.id)}
              style={{
                minHeight: 92,
                justifyContent: 'center',
                borderColor: isOpen ? c.color : undefined,
                background: isOpen ? '#fff' : undefined,
              }}
            >
              <span className="cluster-dot" style={{ background: c.color }} />
              <span className="t" style={{ fontSize: 18 }}>{c.title}</span>
              <span className="d">{c.ages}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="cluster-panel" style={{ borderColor: active.color }}>
          <div className="t-label" style={{ color: active.color }}>{active.title}</div>
          <div className="t-h3" style={{ marginTop: 8 }}>{active.directions.join(' · ')}</div>
          <p className="t-small" style={{ marginTop: 8 }}>
            {active.ages} · від {active.priceFrom} ₴ за заняття · матеріали входять у вартість
          </p>
          <Link
            className="btn btn--small btn--wide"
            href="/zapys"
            style={{ display: 'grid', placeItems: 'center', marginTop: 14, textDecoration: 'none' }}
          >
            Переглянути заняття →
          </Link>
        </div>
      )}
    </section>
  );
}
