/* Летучие мыши над первым экраном в сезон Halloween.
   Только CSS: каждая мышь летит по своей траектории и машет крыльями. */

const BATS = [
  { top: '12%', size: 86, dur: 16, delay: 0, rise: '-80px' },
  { top: '26%', size: 58, dur: 21, delay: -7, rise: '60px' },
  { top: '6%', size: 46, dur: 25, delay: -14, rise: '40px' },
  { top: '40%', size: 66, dur: 19, delay: -3, rise: '-50px' },
];

export function Bat({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={size / 2} aria-hidden="true">
      <g className="hw-wing hw-wing--l">
        <path d="M60 30 C 48 12, 30 6, 4 14 C 14 20, 16 28, 12 36 C 22 30, 30 34, 32 42 C 38 34, 48 34, 60 36 Z" />
      </g>
      <g className="hw-wing hw-wing--r">
        <path d="M60 30 C 72 12, 90 6, 116 14 C 106 20, 104 28, 108 36 C 98 30, 90 34, 88 42 C 82 34, 72 34, 60 36 Z" />
      </g>
      <ellipse cx="60" cy="34" rx="9" ry="12" />
      <path d="M53 24 L 54 14 L 58 22 Z M67 24 L 66 14 L 62 22 Z" />
      <circle cx="56.5" cy="30" r="1.8" fill="#FBD668" />
      <circle cx="63.5" cy="30" r="1.8" fill="#FBD668" />
    </svg>
  );
}

export default function Bats() {
  return (
    <div className="hw-bats" aria-hidden="true">
      {BATS.map((b, i) => (
        <span
          key={i}
          className="hw-bat"
          style={{
            top: b.top,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            ['--rise' as string]: b.rise,
          }}
        >
          <span className="hw-bat-bob" style={{ animationDelay: `${i * -0.4}s` }}>
            <Bat size={b.size} />
          </span>
        </span>
      ))}
    </div>
  );
}
