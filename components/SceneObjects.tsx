/* Девять предметов студии для сцены на первом экране.
   Плоские, 2–3 цвета палитры, одинаковая оптическая вес — набор из дизайн-системы. */

export const OBJECT_IDS = [
  'brush', 'pencil', 'brick', 'gear', 'scissors',
  'drop', 'spool', 'paper', 'bubble',
] as const;

export type ObjectId = (typeof OBJECT_IDS)[number];

export function SceneObject({ id }: { id: ObjectId }) {
  switch (id) {
    case 'brush':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="28" y="4" width="8" height="28" rx="4" fill="#111111" />
          <rect x="24" y="30" width="16" height="9" rx="2" fill="#45C8C8" />
          <path d="M24 39h16l-3 13-5 8-5-8z" fill="#F26F21" />
        </svg>
      );
    case 'pencil':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="25" y="4" width="14" height="32" rx="3" fill="#FBD668" />
          <rect x="25" y="32" width="14" height="6" fill="#111111" />
          <path d="M25 38h14l-7 18z" fill="#F26F21" />
        </svg>
      );
    case 'brick':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="17" y="16" width="11" height="10" rx="3" fill="#4FD1D9" />
          <rect x="36" y="16" width="11" height="10" rx="3" fill="#4FD1D9" />
          <rect x="12" y="24" width="40" height="24" rx="6" fill="#45C8C8" />
        </svg>
      );
    case 'gear':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            fill="#8A8078"
            d="M32 8l5 5h7l2 7 6 4-2 7 2 7-6 4-2 7h-7l-5 5-5-5h-7l-2-7-6-4 2-7-2-7 6-4 2-7h7z"
          />
          <circle cx="32" cy="32" r="9" fill="#FBF7F3" />
        </svg>
      );
    case 'scissors':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 10l20 30M42 10L22 40" stroke="#8A8078" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="47" r="8" fill="none" stroke="#F73FA6" strokeWidth="5" />
          <circle cx="44" cy="47" r="8" fill="none" stroke="#F73FA6" strokeWidth="5" />
        </svg>
      );
    case 'drop':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path fill="#F26F21" d="M32 6c9 12 16 19 16 28a16 16 0 1 1-32 0c0-9 7-16 16-28z" />
        </svg>
      );
    case 'spool':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="18" y="10" width="28" height="6" rx="3" fill="#8A8078" />
          <rect x="18" y="48" width="28" height="6" rx="3" fill="#8A8078" />
          <rect x="24" y="16" width="16" height="32" fill="#F73FA6" />
        </svg>
      );
    case 'paper':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path fill="#FFFFFF" stroke="#E7DFD7" strokeWidth="3" d="M16 8h24l10 10v38H16z" />
          <path d="M23 28h18M23 36h18M23 44h12" stroke="#45C8C8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'bubble':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path fill="#FBD668" d="M12 14h40a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H30l-12 10V44h-6a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" />
          <circle cx="24" cy="29" r="3.5" fill="#111111" />
          <circle cx="34" cy="29" r="3.5" fill="#111111" />
          <circle cx="44" cy="29" r="3.5" fill="#111111" />
        </svg>
      );
  }
}
