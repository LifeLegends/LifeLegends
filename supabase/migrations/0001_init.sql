-- ============================================================================
-- LifeLegends — Initial Production Schema
-- Safe to run multiple times against the same database (idempotent):
-- every CREATE TABLE / CREATE INDEX uses IF NOT EXISTS, and triggers are
-- dropped-then-recreated rather than failing on re-run.
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm; -- trigram indexes for fast ILIKE search

-- ============================================================================
-- CATEGORIES
-- ============================================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  cover_image_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- BIOGRAPHIES (core table)
-- ============================================================================
create table if not exists biographies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  roles text[] not null default '{}',
  birth_year int,
  death_year int,
  nationality text,
  profession text,
  tagline text,
  intro text,
  hero_image_path text,
  thumbnail_path text,
  overview_title text,
  overview text[] not null default '{}', -- ordered paragraphs
  stats jsonb not null default '[]',      -- [{ value, label }]
  featured boolean not null default false,
  view_count bigint not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_biographies_slug on biographies (slug);
create index if not exists idx_biographies_status on biographies (status);
create index if not exists idx_biographies_featured on biographies (featured) where featured = true;
create index if not exists idx_biographies_view_count on biographies (view_count desc);
create index if not exists idx_biographies_name_trgm on biographies using gin (name gin_trgm_ops);

-- ============================================================================
-- BIOGRAPHY <-> CATEGORY (many-to-many, though UI currently uses one primary)
-- ============================================================================
create table if not exists biography_categories (
  biography_id uuid not null references biographies(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  is_primary boolean not null default true,
  primary key (biography_id, category_id)
);

create index if not exists idx_biography_categories_category on biography_categories (category_id);

-- ============================================================================
-- TIMELINE EVENTS
-- ============================================================================
create table if not exists timeline_events (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  year int not null,
  title text not null,
  description text,
  sort_order int not null default 0
);

create index if not exists idx_timeline_events_biography on timeline_events (biography_id, sort_order);

-- ============================================================================
-- ACHIEVEMENTS
-- ============================================================================
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  counter text not null, -- stored as text; numeric achievements parsed client-side for animated counters
  title text not null,
  description text,
  sort_order int not null default 0
);

create index if not exists idx_achievements_biography on achievements (biography_id, sort_order);

-- ============================================================================
-- QUOTES
-- ============================================================================
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  text text not null,
  attribution text not null,
  featured boolean not null default false,
  sort_order int not null default 0
);

create index if not exists idx_quotes_biography on quotes (biography_id, sort_order);

-- One featured quote per biography — recreated safely on re-run.
drop index if exists idx_quotes_one_featured_per_bio;
create unique index idx_quotes_one_featured_per_bio on quotes (biography_id) where featured = true;

-- ============================================================================
-- GALLERY IMAGES
-- ============================================================================
create table if not exists gallery_images (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  caption text,
  sort_order int not null default 0
);

create index if not exists idx_gallery_images_biography on gallery_images (biography_id, sort_order);

-- ============================================================================
-- FACTS
-- ============================================================================
create table if not exists facts (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  summary text not null,
  expand text not null,
  sort_order int not null default 0
);

create index if not exists idx_facts_biography on facts (biography_id, sort_order);

-- ============================================================================
-- SOURCES
-- ============================================================================
create table if not exists sources (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  name text not null,
  description text,
  url text,
  sort_order int not null default 0
);

create index if not exists idx_sources_biography on sources (biography_id, sort_order);

-- ============================================================================
-- SEO METADATA (one-to-one with biographies; kept separate per the SDD's
-- "SEO Manager" concept, and reusable later for categories too)
-- ============================================================================
create table if not exists seo_metadata (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid unique references biographies(id) on delete cascade,
  meta_title text,
  meta_description text,
  canonical_path text,
  og_image_path text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- USERS (admin profile extension — auth.users is managed by Supabase Auth)
-- ============================================================================
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- BOOKMARKS (public-facing feature — requires a logged-in visitor account
-- in a future phase; schema is ready now so BookmarkButton can be wired
-- without another migration)
-- ============================================================================
create table if not exists bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  biography_id uuid not null references biographies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, biography_id)
);

-- ============================================================================
-- PAGE VIEWS (backs the analytics dashboard's "Most Viewed" / trend charts)
-- ============================================================================
create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  biography_id uuid not null references biographies(id) on delete cascade,
  viewed_on date not null default current_date,
  count int not null default 1,
  unique (biography_id, viewed_on)
);

create index if not exists idx_page_views_biography_date on page_views (biography_id, viewed_on desc);

-- ============================================================================
-- updated_at trigger helper
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers can't use IF NOT EXISTS in Postgres, so drop-then-recreate
-- instead of failing when this migration is re-run.
drop trigger if exists trg_biographies_updated_at on biographies;
create trigger trg_biographies_updated_at before update on biographies
  for each row execute function set_updated_at();

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();
