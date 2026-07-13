-- ============================================================================
-- LifeLegends — Full Biography content field
-- Adds long-form biography content, stored as Markdown, separate from the
-- short `intro` (summary) field. Safe to run multiple times.
-- ============================================================================

alter table biographies add column if not exists full_biography text;

comment on column biographies.intro is 'Short summary shown in the hero and card previews.';
comment on column biographies.full_biography is 'Complete long-form biography content, authored as Markdown, rendered on the biography page below the overview section.';
