/* Капі — маскот студии: капибара с мандаринкой на голове
   (у студии есть ростовая кукла-капибара). Рисунок собственный, плоский,
   в цветах бренда. mood меняет только мелочи — щёки и глаза. */
export default function Capy({
  size = 180,
  mood = 'happy',
  hat = false,
  className,
}: {
  size?: number;
  mood?: 'happy' | 'wink';
  /** шляпа ведьмы вместо мандаринки — на Halloween */
  hat?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 210"
      overflow="visible"
      width={size}
      height={(size * 210) / 200}
      role="img"
      aria-label="Капі, капібара студії TVORCHI"
    >
      <ellipse cx="100" cy="160" rx="82" ry="46" fill="#B9825A" />
      <ellipse cx="52" cy="62" rx="12" ry="9" fill="#9C6A45" />
      <ellipse cx="148" cy="62" rx="12" ry="9" fill="#9C6A45" />
      <rect x="38" y="52" width="124" height="108" rx="54" fill="#C9936A" />
      <rect x="62" y="104" width="76" height="48" rx="24" fill="#A9744E" />
      <ellipse cx="88" cy="120" rx="4" ry="3" fill="#3A2418" />
      <ellipse cx="112" cy="120" rx="4" ry="3" fill="#3A2418" />
      <g className="capy-eye"><circle cx="74" cy="92" r="6" fill="#2A1A10" /><circle cx="76" cy="90" r="2" fill="#FFFFFF" /></g>
      {mood === 'wink' ? (
        <path d="M119 92q7-6 14 0" fill="none" stroke="#2A1A10" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <>
          <g className="capy-eye">
            <circle cx="126" cy="92" r="6" fill="#2A1A10" />
            <circle cx="128" cy="90" r="2" fill="#FFFFFF" />
          </g>
        </>
      )}
      <circle cx="58" cy="116" r="9" fill="#F7A6B8" opacity=".75" />
      <circle cx="142" cy="116" r="9" fill="#F7A6B8" opacity=".75" />
      <path d="M88 140q12 8 24 0" fill="none" stroke="#3A2418" strokeWidth="3" strokeLinecap="round" />
      {hat ? (
        <g className="capy-hat">
          <path d="M70 52 C 84 40, 92 22, 104 4 C 110 -2, 122 2, 126 10 C 118 8, 114 12, 116 22 C 118 34, 124 44, 132 52 Z" fill="#2B1A4F" />
          <path d="M80 44 C 94 40, 112 40, 126 44 L 129 50 C 112 46, 94 46, 77 50 Z" fill="#F26F21" />
          <path d="M106 26 l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" fill="#FBD668" />
          <ellipse cx="100" cy="54" rx="50" ry="8" fill="#3A2563" />
        </g>
      ) : (
        <g className="capy-fruit">
          <circle cx="100" cy="42" r="20" fill="#F26F21" />
          <path d="M100 24 C 108 12, 122 12, 124 18 C 116 24, 106 26, 100 24 Z" fill="#3DAA5C" />
        </g>
      )}
      <ellipse cx="74" cy="200" rx="16" ry="8" fill="#9C6A45" />
      <ellipse cx="126" cy="200" rx="16" ry="8" fill="#9C6A45" />
    </svg>
  );
}
