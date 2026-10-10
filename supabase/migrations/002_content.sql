-- ============================================================
-- TVORCHI — контент, который студия ведёт сама через админку
--   • галерея работ (гирлянда на главной + страница галереи)
--   • анонсы событий (вместо Google-таблицы)
--   • фото к мастер-классам
--   • хранилище файлов media (публичное чтение, запись только с сервера)
-- Выполняется после 001_init.sql. Повторный запуск безопасен.
-- ============================================================

-- ---------- Галерея работ ----------
create table if not exists gallery_items (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  image_path    text not null,          -- путь в бакете media: gallery/<uuid>.jpg
  caption       text,                   -- необов'язково: «Соня, 6 р.» — лише зі згоди батьків
  sort          int not null default 0, -- менше число = раніше
  on_home       boolean not null default true,  -- показувати на гірлянді головної
  active        boolean not null default true
);
create index if not exists gallery_items_sort_idx on gallery_items (sort, created_at desc);

-- ---------- Анонсы ----------
create table if not exists announcements (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  title         text not null,
  cover_path    text,                   -- афіша в бакеті media: announcements/<uuid>.jpg
  starts_at     timestamptz not null,
  ends_at       timestamptz,            -- порожньо = до кінця дня початку
  place         text,
  age           text,
  short         text,
  full_text     text,
  price         text,                   -- вільний текст: «безкоштовно», «350 ₴»
  seats         int,                    -- 0 = місць немає; порожньо = не показувати
  link          text,
  active        boolean not null default true
);
create index if not exists announcements_ends_idx on announcements (ends_at, starts_at);

-- ---------- Фото мастер-классов ----------
-- Ключ — slug мастер-класса из lib/data.ts. Нет строки = заглушка-клякса.
create table if not exists masterclass_photos (
  slug          text primary key,
  image_path    text not null,
  updated_at    timestamptz not null default now()
);

-- ---------- RLS ----------
alter table gallery_items      enable row level security;
alter table announcements      enable row level security;
alter table masterclass_photos enable row level security;

drop policy if exists "public reads active gallery" on gallery_items;
create policy "public reads active gallery"
  on gallery_items for select to anon, authenticated
  using (active = true);

drop policy if exists "public reads active announcements" on announcements;
create policy "public reads active announcements"
  on announcements for select to anon, authenticated
  using (active = true);

drop policy if exists "public reads masterclass photos" on masterclass_photos;
create policy "public reads masterclass photos"
  on masterclass_photos for select to anon, authenticated
  using (true);

-- Запись во все три таблицы — только сервисным ключом из админки.

-- ---------- Хранилище файлов ----------
-- Публичный бакет: картинки отдаются по прямой ссылке без ключа.
-- Загружать и удалять может только сервер (service_role обходит RLS).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
