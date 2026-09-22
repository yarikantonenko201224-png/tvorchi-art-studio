/* Заявки: единая модель для всех форм сайта.
   Пока Supabase не подключён, заявка пишется в лог сервера —
   форма всё равно отвечает успехом, а данные не теряются молча. */

import { insert, select, update, isSupabaseReady } from './supabase';

export type LeadSource = 'trial' | 'masterclass' | 'birthday' | 'certificate' | 'quiz';
export type LeadStatus = 'new' | 'called' | 'trial_planned' | 'client' | 'lost';

export interface LeadInput {
  source: LeadSource;
  childName?: string;
  childAge?: number;
  parentName?: string;
  phone: string;
  email?: string;
  direction?: string;
  lessonId?: string;
  people?: number;
  amount?: number;
  payload?: Record<string, unknown>;
}

export interface Lead {
  id: string;
  created_at: string;
  source: LeadSource;
  status: LeadStatus;
  child_name: string | null;
  child_age: number | null;
  parent_name: string | null;
  phone: string;
  email: string | null;
  direction: string | null;
  lesson_id: string | null;
  people: number | null;
  amount: number | null;
  payload: Record<string, unknown> | null;
  note: string | null;
}

export async function createLead(input: LeadInput): Promise<{ ok: boolean; stored: boolean }> {
  const row = {
    source: input.source,
    child_name: input.childName ?? null,
    child_age: input.childAge ?? null,
    parent_name: input.parentName ?? null,
    phone: input.phone,
    email: input.email ?? null,
    direction: input.direction ?? null,
    lesson_id: input.lessonId ?? null,
    people: input.people ?? null,
    amount: input.amount ?? null,
    payload: input.payload ?? null,
  };

  if (!isSupabaseReady()) {
    /* База ещё не подключена. Пишем в лог, чтобы заявку можно было
       достать из логов Vercel, и честно сообщаем вызывающему коду. */
    console.warn('[lead] Supabase не підключено, заявка лише в логах:', JSON.stringify(row));
    return { ok: true, stored: false };
  }

  await insert('leads', row);
  return { ok: true, stored: true };
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  return select<Lead>('leads', `order=created_at.desc&limit=${limit}`);
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await update('leads', id, { status });
}

/* Сколько часов заявка висит без реакции — по этому админка подсвечивает
   просроченные. Правило из спеки: «нова» дольше суток требует внимания. */
export function hoursSince(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 3_600_000);
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Нова',
  called: 'Зателефонували',
  trial_planned: 'Пробне заплановане',
  client: 'Клієнт',
  lost: 'Втрачено',
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  trial: 'Пробне заняття',
  masterclass: 'Майстер-клас',
  birthday: 'День народження',
  certificate: 'Сертифікат',
  quiz: 'Підбір',
};
