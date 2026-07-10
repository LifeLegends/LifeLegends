-- ============================================================================
-- LifeLegends — Image metadata columns
-- Adds alt/caption to the hero image (single "Image Block" use case) and
-- title/description to gallery images, needed by the new CMS upload system.
-- ============================================================================

alter table biographies add column if not exists hero_image_alt text;
alter table biographies add column if not exists hero_image_caption text;

alter table gallery_images add column if not exists title text;
alter table gallery_images add column if not exists description text;

alter table categories add column if not exists cover_image_alt text;
