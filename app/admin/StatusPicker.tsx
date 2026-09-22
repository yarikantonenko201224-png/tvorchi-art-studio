'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_LABELS, type LeadStatus } from '@/lib/leads';

/* Смена статуса заявки одним выбором.
   Администратор работает с телефона, поэтому это нативный select:
   он открывается системным списком и не требует точных попаданий. */
export default function StatusPicker({ id, status }: { id: string; status: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(status);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function change(next: LeadStatus) {
    const previous = value;
    setValue(next);

    const res = await fetch('/api/leads/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: next }),
    });

    if (!res.ok) {
      setValue(previous); // откатываем, чтобы не показывать несуществующее состояние
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <select
      className="lead-status"
      value={value}
      disabled={pending}
      onChange={(e) => change(e.target.value as LeadStatus)}
      aria-label="Статус заявки"
    >
      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
