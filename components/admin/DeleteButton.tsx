'use client';

import { useState } from 'react';

/* Удаление в два нажатия вместо window.confirm:
   системные диалоги неудобны на телефоне и блокируют страницу. */
export default function DeleteButton({ onConfirm, label = 'Видалити' }: { onConfirm: () => void; label?: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <button type="button" className="admin-link admin-link--danger" onClick={onConfirm} onBlur={() => setArmed(false)} autoFocus>
      Точно видалити?
    </button>
  ) : (
    <button type="button" className="admin-link admin-link--danger" onClick={() => setArmed(true)}>
      {label}
    </button>
  );
}
