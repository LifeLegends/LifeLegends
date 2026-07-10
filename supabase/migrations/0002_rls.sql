-- ============================================================================
-- LifeLegends — Row Level Security
-- Public (anon) role: read-only, published content only.
-- Authenticated admins (rows in `users` with role admin/editor): full CRUD.
-- Safe to run multiple times: every policy is dropped before recreation,
-- since Postgres has no CREATE POLICY IF NOT EXISTS.
-- Run AFTER 0001_init.sql.
-- ============================================================================

alter table biographies enable row level security;
alter table biography_categories enable row level security;
alter table timeline_events enable row level security;
alter table achievements enable row level security;
alter table quotes enable row level security;
alter table gallery_images enable row level security;
alter table facts enable row level security;
alter table sources enable row level security;
alter table seo_metadata enable row level security;
alter table categories enable row level security;
alter table users enable row level security;
alter table bookmarks enable row level security;
alter table page_views enable row level security;

-- Helper: is the current request from an authenticated admin/editor?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from users where id = auth.uid() and role in ('admin', 'editor')
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Public read access — published content only
-- ---------------------------------------------------------------------------
drop policy if exists "Public can read published biographies" on biographies;
create policy "Public can read published biographies"
  on biographies for select
  using (status = 'published' or is_admin());

drop policy if exists "Public can read categories" on categories;
create policy "Public can read categories"
  on categories for select
  using (true);

drop policy if exists "Public can read biography_categories" on biography_categories;
create policy "Public can read biography_categories"
  on biography_categories for select
  using (true);

drop policy if exists "Public can read timeline_events of published biographies" on timeline_events;
create policy "Public can read timeline_events of published biographies"
  on timeline_events for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read achievements of published biographies" on achievements;
create policy "Public can read achievements of published biographies"
  on achievements for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read quotes of published biographies" on quotes;
create policy "Public can read quotes of published biographies"
  on quotes for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read gallery_images of published biographies" on gallery_images;
create policy "Public can read gallery_images of published biographies"
  on gallery_images for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read facts of published biographies" on facts;
create policy "Public can read facts of published biographies"
  on facts for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read sources of published biographies" on sources;
create policy "Public can read sources of published biographies"
  on sources for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

drop policy if exists "Public can read seo_metadata of published biographies" on seo_metadata;
create policy "Public can read seo_metadata of published biographies"
  on seo_metadata for select
  using (exists (select 1 from biographies b where b.id = biography_id and (b.status = 'published' or is_admin())));

-- ---------------------------------------------------------------------------
-- Admin write access — all mutating operations require admin/editor role
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can insert biographies" on biographies;
create policy "Admins can insert biographies" on biographies for insert with check (is_admin());
drop policy if exists "Admins can update biographies" on biographies;
create policy "Admins can update biographies" on biographies for update using (is_admin());
drop policy if exists "Admins can delete biographies" on biographies;
create policy "Admins can delete biographies" on biographies for delete using (is_admin());

drop policy if exists "Admins can manage categories" on categories;
create policy "Admins can manage categories" on categories for insert with check (is_admin());
drop policy if exists "Admins can update categories" on categories;
create policy "Admins can update categories" on categories for update using (is_admin());
drop policy if exists "Admins can delete categories" on categories;
create policy "Admins can delete categories" on categories for delete using (is_admin());

drop policy if exists "Admins can manage biography_categories" on biography_categories;
create policy "Admins can manage biography_categories" on biography_categories for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage timeline_events" on timeline_events;
create policy "Admins can manage timeline_events" on timeline_events for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage achievements" on achievements;
create policy "Admins can manage achievements" on achievements for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage quotes" on quotes;
create policy "Admins can manage quotes" on quotes for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage gallery_images" on gallery_images;
create policy "Admins can manage gallery_images" on gallery_images for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage facts" on facts;
create policy "Admins can manage facts" on facts for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage sources" on sources;
create policy "Admins can manage sources" on sources for all using (is_admin()) with check (is_admin());
drop policy if exists "Admins can manage seo_metadata" on seo_metadata;
create policy "Admins can manage seo_metadata" on seo_metadata for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Users table — admins can see other admin profiles; each user can read/update their own row
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own profile" on users;
create policy "Users can read own profile" on users for select using (auth.uid() = id or is_admin());
drop policy if exists "Users can update own profile" on users;
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Bookmarks — a visitor can only see/manage their own bookmarks
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own bookmarks" on bookmarks;
create policy "Users can read own bookmarks" on bookmarks for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own bookmarks" on bookmarks;
create policy "Users can insert own bookmarks" on bookmarks for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own bookmarks" on bookmarks;
create policy "Users can delete own bookmarks" on bookmarks for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Page views — publicly insertable (to record a view) but only admins can read aggregates
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can record a page view" on page_views;
create policy "Anyone can record a page view" on page_views for insert with check (true);
drop policy if exists "Admins can read page views" on page_views;
create policy "Admins can read page views" on page_views for select using (is_admin());

-- ---------------------------------------------------------------------------
-- Auto-create a `users` row (role: editor by default) whenever a new
-- Supabase Auth user is created. Promote to 'admin' manually via SQL editor
-- for the first real administrator account.
-- ---------------------------------------------------------------------------
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, display_name, role)
  values (new.id, new.email, 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Backfill: any auth.users row created BEFORE this trigger existed (e.g. an
-- admin account created via the Supabase dashboard prior to running this
-- migration) would have no matching `users` row — silently making
-- is_admin() return false for a real admin and breaking every upload/CRUD
-- action. This repairs that automatically and safely on every re-run.
-- ---------------------------------------------------------------------------
insert into public.users (id, display_name, role)
select id, email, 'editor' from auth.users
on conflict (id) do nothing;
