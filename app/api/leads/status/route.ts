import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin-auth';
import { setLeadStatus, type LeadStatus } from '@/lib/leads';

const STATUSES: LeadStatus[] = ['new', 'called', 'trial_planned', 'client', 'lost'];

export async function POST(request: Request) {
  /* Смена статуса доступна только из админки: без этой проверки
     любой желающий мог бы перекладывать чужие заявки. */
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; status?: LeadStatus };
  if (!body.id || !body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    await setLeadStatus(body.id, body.status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/leads/status]', error);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
