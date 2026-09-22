import { isAuthorized, isAdminConfigured } from '@/lib/admin-auth';
import { isSupabaseReady } from '@/lib/supabase';
import { listLeads, hoursSince, STATUS_LABELS, SOURCE_LABELS, type Lead, type LeadStatus } from '@/lib/leads';
import StatusPicker from './StatusPicker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Адмінка — TVORCHI',
  robots: { index: false, follow: false },
};

const COLUMNS: LeadStatus[] = ['new', 'called', 'trial_planned', 'client', 'lost'];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <div className="page" style={{ paddingTop: 40 }}>
        <h1 className="t-h1">Адмінка не налаштована</h1>
        <p className="t-lead">
          Задайте змінну <code>ADMIN_PASSWORD</code> у налаштуваннях проєкту —
          після цього тут з’явиться вхід.
        </p>
      </div>
    );
  }

  if (!(await isAuthorized())) {
    return (
      <div className="page" style={{ paddingTop: 40, maxWidth: 420 }}>
        <h1 className="t-h1">Вхід</h1>
        <p className="t-lead">Панель адміністратора студії.</p>

        <form action="/admin/login" method="post" className="field">
          <label className="t-label" htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            autoComplete="current-password"
            autoFocus
          />
          {params.error && <p className="error">Невірний пароль</p>}
          <button className="btn btn--wide" style={{ marginTop: 16 }} type="submit">
            Увійти
          </button>
        </form>
      </div>
    );
  }

  if (!isSupabaseReady()) {
    return (
      <div className="page" style={{ paddingTop: 40 }}>
        <h1 className="t-h1">База даних не підключена</h1>
        <p className="t-lead">
          Заявки поки що не зберігаються — вони пишуться в логи сервера.
          Щоб вони потрапляли сюди, підключіть Supabase: інструкція в{' '}
          <code>docs/SUPABASE.md</code>.
        </p>
      </div>
    );
  }

  const leads = await listLeads(200);
  const byStatus = (status: LeadStatus) => leads.filter((l) => l.status === status);

  const today = leads.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const stale = leads.filter((l) => l.status === 'new' && hoursSince(l.created_at) >= 24).length;

  return (
    <div className="page admin" style={{ paddingTop: 28 }}>
      <div className="admin-head">
        <div>
          <h1 className="t-h1">Заявки</h1>
          <p className="t-small" style={{ marginTop: 6 }}>
            {leads.length} усього · {today} сьогодні
            {stale > 0 && (
              <>
                {' · '}
                <b style={{ color: 'var(--state-error)' }}>{stale} без реакції понад добу</b>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="kanban">
        {COLUMNS.map((status) => {
          const items = byStatus(status);
          return (
            <section className="kanban-col" key={status}>
              <header className="kanban-col-head">
                <span>{STATUS_LABELS[status]}</span>
                <span className="kanban-count">{items.length}</span>
              </header>

              {items.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}

              {items.length === 0 && <p className="kanban-empty">Порожньо</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const hours = hoursSince(lead.created_at);
  const overdue = lead.status === 'new' && hours >= 24;

  return (
    <article className={`lead-card${overdue ? ' is-overdue' : ''}`}>
      {overdue && <div className="lead-overdue">{hours} годин без реакції</div>}

      <div className="lead-title">
        {lead.child_name || lead.parent_name || 'Без імені'}
        {lead.child_age ? `, ${lead.child_age}` : ''}
      </div>

      <div className="t-small" style={{ marginTop: 4 }}>
        {lead.direction || SOURCE_LABELS[lead.source]}
      </div>

      <div className="lead-tags">
        <span className="badge">{SOURCE_LABELS[lead.source]}</span>
        {lead.people && lead.people > 1 && <span className="badge">{lead.people} осіб</span>}
        {lead.amount && <span className="badge badge--warn">{lead.amount} ₴</span>}
      </div>

      <a className="lead-phone" href={`tel:${lead.phone}`}>{lead.phone}</a>

      <div className="lead-actions">
        <a className="btn btn--small" href={`tel:${lead.phone}`}
           style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Подзвонити
        </a>
        <a className="btn btn--small btn--ghost"
           href={`viber://chat?number=%2B${lead.phone.replace(/\D/g, '')}`}
           style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
          Viber
        </a>
      </div>

      <StatusPicker id={lead.id} status={lead.status} />
    </article>
  );
}
