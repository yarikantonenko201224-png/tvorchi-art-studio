'use client';

import { pickInForm } from './EventForm';

/* Кнопка на карточке темы: отмечает тему в форме и прокручивает к ней. */
export default function ThemeCardButton({ title }: { title: string }) {
  return (
    <button type="button" className="pv-theme-btn" onClick={() => pickInForm('theme', title)}>
      Хочу цю вечірку <i aria-hidden="true">→</i>
    </button>
  );
}
