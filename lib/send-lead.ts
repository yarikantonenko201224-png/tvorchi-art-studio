/* Отправка заявки с любой формы сайта.

   Одна функция на все формы, чтобы правило было одинаковым везде:
   посетитель никогда не видит ошибку отправки. Он свою часть сделал —
   оставил телефон. Если сеть подвела, сбой будет виден в логах сервера,
   а экран подтверждения всё равно покажется.

   Таймаут 8 секунд: во встроенном браузере Instagram на слабом 4G
   запрос может висеть бесконечно, а человек не должен ждать. */

import type { LeadSource } from './leads';
import { trackLead } from '@/components/Analytics';

export interface LeadPayload {
  source: LeadSource;
  phone: string;
  childName?: string;
  childAge?: number;
  parentName?: string;
  email?: string;
  direction?: string;
  lessonId?: string;
  people?: number;
  amount?: number;
  payload?: Record<string, unknown>;
}

export async function sendLead(lead: LeadPayload): Promise<void> {
  trackLead(lead.source);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, company: '' }), // company — ловушка для ботов
      signal: controller.signal,
    });
  } catch {
    /* см. комментарий выше: молча, без ошибки для посетителя */
  } finally {
    clearTimeout(timer);
  }
}
