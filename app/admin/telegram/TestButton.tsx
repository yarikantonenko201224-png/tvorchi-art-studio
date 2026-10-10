'use client';

import { useState } from 'react';

export default function TestButton({ chatId }: { chatId: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | string>('idle');
  async function send() {
    setState('busy');
    const res = await fetch('/api/admin/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setState(res?.ok ? 'ok' : data?.error || 'Помилка');
  }
  return (
    <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <button type="button" className="btn btn--small btn--ghost" onClick={send} disabled={state === 'busy'}>
        {state === 'busy' ? 'Надсилаємо…' : 'Надіслати тест'}
      </button>
      {state === 'ok' && <span style={{ color: '#2E8B57', fontWeight: 700 }}>Надіслано ✓</span>}
      {state !== 'idle' && state !== 'busy' && state !== 'ok' && <span className="error">{state}</span>}
    </span>
  );
}

export function ManualTest() {
  const [id, setId] = useState('');
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 10 }}>
      <input className="input admin-input" style={{ maxWidth: 220 }} placeholder="123456789" value={id} onChange={(e) => setId(e.target.value.trim())} inputMode="numeric" />
      {id && <TestButton chatId={id} />}
    </div>
  );
}
