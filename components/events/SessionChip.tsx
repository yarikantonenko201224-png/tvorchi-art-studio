'use client';

import { pickInForm } from './EventForm';

/* Дата заняття на картці: натиснули — вона обрана у формі запису. */
export default function SessionChip({ value, place, label, past }: { value: string; place: string; label: string; past?: boolean }) {
  return (
    <button
      type="button"
      className={`oc-chip oc-chip--${place === 'Раківка' ? 'r' : 'm'}`}
      disabled={past}
      onClick={() => pickInForm('session', value)}
      title={past ? 'Вже минуло' : 'Записатися на цю дату'}
    >
      <b>{place}</b>
      <span>{label}</span>
      {past && <i>минуло</i>}
    </button>
  );
}
