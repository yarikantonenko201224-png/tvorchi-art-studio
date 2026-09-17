import Link from 'next/link';

/* Логотип: SVG-клякса + надпись Caveat (перерисовка из макетов Claude Design).
   Оригинал существует только в PNG — см. docs/BRAND-ASSETS.md.

   Два варианта, потому что одна композиция не работает во всех размерах:

   • inline — для шапки. Надпись ведущая, клякса за ней акцентом.
     Читается от 40px высоты. Геометрия один в один из макета.

   • stamp — для первого экрана и футера. Клякса ведущая, надпись внутри,
     как в оригинальном знаке. Нужна высота от ~90px, иначе текст нечитаем.

   Внимание: SVG-коробка должна сохранять пропорции viewBox (200×180),
   иначе клякса вписывается по меньшей стороне и выходит вдвое мельче. */

const BLOT_PATH =
  'M96 6C128 2 150 20 156 44C160 60 176 62 186 78C196 94 190 114 172 122C158 128 156 146 140 158C122 172 96 174 78 164C62 155 44 162 30 150C14 136 12 112 22 96C30 82 20 66 26 48C33 28 60 10 96 6Z';

type Variant = 'inline' | 'stamp';

const GEO = {
  inline: {
    baseH: 46, boxW: 118, boxH: 46,
    blob: { left: -22, top: -2, w: 134, h: 52 },
    title: { left: 0, top: 2, size: 25 },
    sub: { left: 2, top: 27, size: 11, ls: 1.4 },
  },
  stamp: {
    baseH: 90, boxW: 110, boxH: 90,
    blob: { left: 0, top: 0, w: 100, h: 90 },
    title: { left: 8, top: 24, size: 25 },
    sub: { left: 12, top: 50, size: 11, ls: 1.4 },
  },
} as const;

type Props = {
  href?: string | null;
  variant?: Variant;
  height?: number;
};

export default function Logo({ href = '/', variant = 'inline', height }: Props) {
  const g = GEO[variant];
  const h = height ?? g.baseH;
  const k = h / g.baseH;
  const px = (v: number) => `${(v * k).toFixed(2)}px`;

  const mark = (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: px(g.boxW),
        height: px(g.boxH),
        flex: 'none',
      }}
    >
      <svg
        viewBox="0 0 200 180"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: px(g.blob.left),
          top: px(g.blob.top),
          width: px(g.blob.w),
          height: px(g.blob.h),
        }}
      >
        <path fill="#F26F21" d={BLOT_PATH} />
      </svg>

      <span
        style={{
          position: 'absolute',
          left: px(g.title.left),
          top: px(g.title.top),
          fontFamily: 'var(--font-caveat), cursive',
          fontWeight: 700,
          fontSize: px(g.title.size),
          lineHeight: 1,
          color: '#111',
        }}
      >
        TVORCHI
      </span>

      <span
        style={{
          position: 'absolute',
          left: px(g.sub.left),
          top: px(g.sub.top),
          fontFamily: 'var(--font-caveat), cursive',
          fontWeight: 700,
          fontSize: px(g.sub.size),
          lineHeight: 1,
          letterSpacing: px(g.sub.ls),
          color: '#111',
        }}
      >
        ART STUDIO
      </span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="logo" aria-label="TVORCHI ART STUDIO — на головну">
      {mark}
    </Link>
  );
}
