'use client';

import { pickInForm } from './EventForm';

/* Дата в календаре: сразу выбирает этот захід у формі й веде до запису. */
export default function CalendarItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <button type="button" className="oc-cal-item" onClick={() => pickInForm('session', value)}>
      {children}
    </button>
  );
}
