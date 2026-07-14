-- ============================================================================
-- LifeLegends — Category management fields + Tags system
-- Safe to run multiple times.
-- ============================================================================

alter table categories add column if not exists status text not null default 'active' check (status in ('active', 'disabled'));
alter table categories add column if not exists featured boolean not null default false;
alter table categories add column if not exists seo_title text;
alter table categories add column if not exists seo_description text;
alter table categories add column if not exists og_image_path text;

create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists biography_tags (
  biography_id uuid not null references biographies(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (biography_id, tag_id)
);

create index if not exists idx_biography_tags_tag on biography_tags (tag_id);

alter table tags enable row level security;
alter table biography_tags enable row level security;

drop policy if exists "Public can read tags" on tags;
create policy "Public can read tags" on tags for select using (true);
drop policy if exists "Admins can manage tags" on tags;
create policy "Admins can manage tags" on tags for all using (is_admin()) with check (is_admin());

drop policy if exists "Public can read biography_tags" on biography_tags;
create policy "Public can read biography_tags" on biography_tags for select using (true);
drop policy if exists "Admins can manage biography_tags" on biography_tags;
create policy "Admins can manage biography_tags" on biography_tags for all using (is_admin()) with check (is_admin());
