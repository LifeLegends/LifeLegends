-- ============================================================================
-- LifeLegends — Storage bucket + policies
-- Creates the 'media' bucket used by lib/supabase/storage.ts and sets
-- public-read / admin-write policies on storage.objects for that bucket.
-- Safe to run multiple times.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_admin());

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update
  using (bucket_id = 'media' and is_admin());

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and is_admin());
