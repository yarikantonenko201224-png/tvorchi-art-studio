-- ============================================================
-- TVORCHI — начальная схема
-- Выполняется в Supabase → SQL Editor → New query → Run
--
-- Принцип: публичный сайт умеет только ВСТАВЛЯТЬ заявки и ЧИТАТЬ
-- открытые данные (расписание, анонсы). Всё остальное — только
-- через сервисный ключ, который живёт на сервере и в браузер не попадает.
-- ============================================================

-- ---------- Заявки ----------
-- Главная таблица на старте: сюда падают все обращения с сайта.
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  source        text not null,          -- trial | masterclass | birthday | certificate | quiz
  status        text not null default 'new',
                                        -- new | called | trial_planned | client | lost
  child_name    text,
  child_age     int,
  parent_name   text,
  phone         text not null,
  email         text,
  messenger     text,

  direction     text,                   -- напрям або назва майстер-класу
  lesson_id     text,                   -- id заняття з розкладу, якщо обране
  people        int,                    -- кількість учасників (МК, свята)
  amount        numeric,                -- сума заявки, якщо рахується
  payload       jsonb,                  -- повний знімок вибору: пакет ДР, відповіді квізу
  note          text,                   -- коментар адміністратора
  utm           jsonb                   -- звідки прийшов: джерело, кампанія
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

-- ---------- Дети и родители (появятся на фазе CRM) ----------
create table if not exists parents (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  phone       text not null unique,
  email       text,
  messenger   text,
  note        text
);

create table if not exists children (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  parent_id     uuid references parents (id) on delete cascade,
  name          text not null,
  birth_date    date,
  age_group     text,                  -- 3-4 | 5-6 | 7-8 | 9+
  consent_photo boolean not null default false,
  note          text
);

-- ---------- Группы и занятия ----------
create table if not exists groups (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  direction     text not null,
  age_group     text not null,
  location      text not null,         -- rakivka | molodizhny
  weekday       int not null,          -- 1 = понеділок … 7 = неділя
  start_time    time not null,
  duration_min  int not null,
  price_tier    text not null default 'std',   -- std | rob | tut
  size_max      int not null default 8,        -- орієнтир, не жорсткий ліміт
  active        boolean not null default true
);

create table if not exists enrollments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  child_id    uuid not null references children (id) on delete cascade,
  group_id    uuid not null references groups (id) on delete cascade,
  status      text not null default 'trial',   -- trial | active | paused | left
  started_at  date,
  ended_at    date,
  unique (child_id, group_id)
);

create table if not exists lessons (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references groups (id) on delete cascade,
  date        date not null,
  status      text not null default 'planned', -- planned | done | cancelled
  unique (group_id, date)
);

-- Посещаемость. Статусы заданы правилом владелицы:
--   present         — був
--   sick            — хворів, попередили: 7 днів на відпрацювання
--   notified_absent — попередили з інших причин: відпрацювання до кінця абонемента
--   no_show         — не попередили: заняття списується
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons (id) on delete cascade,
  child_id    uuid not null references children (id) on delete cascade,
  status      text not null,
  marked_at   timestamptz not null default now(),
  makeup_due  date,                    -- до якої дати можна відпрацювати
  unique (lesson_id, child_id)
);

-- ---------- Абонементы и оплаты ----------
create table if not exists subscriptions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  child_id       uuid not null references children (id) on delete cascade,
  kind           text not null,        -- pack | unlimited
  lessons_total  int,                  -- для pack: 4 / 8 / 12
  lessons_used   int not null default 0,
  price          numeric not null,
  starts_at      date not null,
  expires_at     date not null,
  status         text not null default 'active'  -- active | finished | expired
);

create table if not exists payments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  parent_id   uuid references parents (id) on delete set null,
  child_id    uuid references children (id) on delete set null,
  amount      numeric not null,
  method      text not null default 'cash',     -- cash | transfer
  purpose     text not null,                    -- subscription | mk | birthday | certificate
  ref_id      uuid,
  note        text
);

-- ---------- Сертификаты ----------
create table if not exists certificates (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  code         text not null unique,
  kind         text not null,          -- lesson | masterclass | individual | amount
  amount       numeric,
  balance      numeric,                -- залишок: номінал можна витрачати частинами
  recipient    text,
  from_name    text,
  phone        text,
  email        text,
  format       text not null default 'digital', -- digital | printed
  issued_at    date not null default current_date,
  expires_at   date not null,          -- 3 місяці з моменту придбання
  status       text not null default 'active'   -- active | used | expired
);

-- ============================================================
-- RLS: сайт может только оставлять заявки
-- ============================================================

alter table leads         enable row level security;
alter table parents       enable row level security;
alter table children      enable row level security;
alter table groups        enable row level security;
alter table enrollments   enable row level security;
alter table lessons       enable row level security;
alter table attendance    enable row level security;
alter table subscriptions enable row level security;
alter table payments      enable row level security;
alter table certificates  enable row level security;

-- Анонимный посетитель может ТОЛЬКО вставить заявку.
-- Читать заявки он не может: там телефоны чужих людей.
drop policy if exists "anon can insert leads" on leads;
create policy "anon can insert leads"
  on leads for insert
  to anon
  with check (true);

-- Расписание открыто на чтение — это публичная информация.
drop policy if exists "anyone can read active groups" on groups;
create policy "anyone can read active groups"
  on groups for select
  to anon, authenticated
  using (active = true);

-- Всё остальное без политик: значит, доступно только через
-- service_role ключ, который используется на сервере в админке.
