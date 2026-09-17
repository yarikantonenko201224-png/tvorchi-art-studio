/* Иконки разделов. Плоские, 2–3 цвета палитры, узнаются с одного взгляда. */

export function BrushIcon({ light = false }: { light?: boolean }) {
  const body = light ? '#FFFFFF' : '#F26F21';
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {/* ручка */}
      <rect x="28" y="4" width="8" height="22" rx="4" fill={light ? 'rgba(255,255,255,.65)' : '#111111'} />
      {/* обойма */}
      <rect x="24" y="24" width="16" height="8" rx="2.5" fill="#FBD668" />
      {/* ворс */}
      <path d="M24 32h16v9a8 8 0 0 1-16 0z" fill={body} />
      {/* капля краски */}
      <path d="M32 47c3 4.5 5 7 5 9.5a5 5 0 0 1-10 0c0-2.5 2-5 5-9.5z" fill={light ? 'rgba(255,255,255,.85)' : '#45C8C8'} />
    </svg>
  );
}

export function PaletteIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        fill="#FBD668"
        d="M32 7c13.8 0 25 8.6 25 19.6 0 6.7-5.6 9.2-9.6 10.4-2.8.9-4.6 1.7-4.6 4.2 0 2.6 1.8 3.8 1.8 6.4 0 4.2-4.8 7.4-11 7.4C18.6 55 7 43.6 7 30.4 7 17.6 18.2 7 32 7z"
      />
      <circle cx="21" cy="26" r="4.2" fill="#F26F21" />
      <circle cx="33" cy="19" r="4.2" fill="#45C8C8" />
      <circle cx="45" cy="25" r="4.2" fill="#F73FA6" />
      <circle cx="19" cy="39" r="4.2" fill="#4FD1D9" />
    </svg>
  );
}

export function CakeIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="32" width="44" height="22" rx="7" fill="#F73FA6" />
      <path d="M10 39c4 0 4 4 8 4s4-4 8-4 4 4 8 4 4-4 8-4 4 4 8 4 4-4 4-4v-2a7 7 0 0 0-7-7H17a7 7 0 0 0-7 7z" fill="#4FD1D9" />
      <rect x="30" y="14" width="4" height="14" rx="2" fill="#8A8078" />
      <path d="M32 6c3 3.5 4.5 5.5 4.5 7.5A4.5 4.5 0 0 1 32 18a4.5 4.5 0 0 1-4.5-4.5C27.5 11.5 29 9.5 32 6z" fill="#FBD668" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="14" width="48" height="42" rx="8" fill="#45C8C8" />
      <rect x="8" y="14" width="48" height="12" rx="8" fill="#12706F" />
      <rect x="18" y="7" width="5" height="12" rx="2.5" fill="#8A8078" />
      <rect x="41" y="7" width="5" height="12" rx="2.5" fill="#8A8078" />
      <rect x="17" y="33" width="11" height="6" rx="3" fill="#fff" />
      <rect x="36" y="33" width="11" height="6" rx="3" fill="#fff" />
      <rect x="17" y="44" width="11" height="6" rx="3" fill="#fff" />
    </svg>
  );
}
