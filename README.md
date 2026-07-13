# LifeLegends

A premium biography platform — Next.js App Router + TypeScript + Supabase.

## Push this to GitHub

```bash
# 1. Unzip this project, then from inside the folder:
git init
git add .
git commit -m "Initial commit — LifeLegends"

# 2. Create a new empty repo on GitHub (github.com/new — do NOT initialize
#    it with a README, so there's no merge conflict), then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in your real Supabase values
npm run dev
```

## Before it actually works, you need to:

1. **Create a Supabase project** at supabase.com (free tier is fine).
2. **Run the migrations in order**, via the Supabase SQL Editor or `supabase db push`:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_storage_policies.sql`
   - `supabase/migrations/0004_image_metadata.sql`
   - `supabase/migrations/0005_categories_tags.sql`
   - `supabase/seed.sql` (optional — seeds 10 example biographies)
3. **Set environment variables** in `.env.local` (and in your host's dashboard for production — e.g. Vercel):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. **Create your first admin account**: sign up once through Supabase Auth (dashboard → Authentication → Add User, or build a one-time signup form), then in the SQL Editor run:
   ```sql
   update users set role = 'admin' where id = '<the new user's UUID>';
   ```
5. Deploy (e.g. `vercel deploy`), setting the same env vars there.

## What's real vs. what's still needed

**Fully implemented:** homepage, biography pages, categories, search (with keyboard shortcut), real Supabase auth (login/logout/password reset), admin dashboard, biography CRUD with real image upload (drag-drop, progress, Supabase Storage — no manual URLs), category CRUD with dependency-aware deletion, media library.

**Not implemented** (flagged honestly, not faked): tag management UI, autosave, revision history, bulk actions on the biography list, in-browser image crop/rotate, the full "Website Settings" branding dashboard (multiple logo variants, favicon manager, homepage CMS fields, social links, etc.).
