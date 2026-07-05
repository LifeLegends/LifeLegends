# LifeLegends — Static Preview Site

This bundle is the CLIENT-DEMO version: real HTML/CSS/JS, real GSAP/Lenis
animation, no build step — but no live database. It's meant to be shared
for design/UX approval, not to run as the real production CMS.

## Deploy this demo live in 2 minutes (any of these work):

### Option A — Netlify (drag & drop, easiest)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. Done — you get a live URL immediately (e.g. yoursite.netlify.app).

### Option B — Vercel
1. Go to https://vercel.com/new
2. Choose "Deploy without Git" / upload this folder.
3. Done.

### Option C — GitHub Pages
1. Create a new GitHub repo, upload these files to it.
2. Repo Settings → Pages → Deploy from branch → main → / (root).
3. Your site is live at yourname.github.io/reponame.

## Pages in this bundle
- index.html                    → Homepage
- lifelegends-biography.html    → Nikola Tesla biography page
- lifelegends-categories.html   → Categories + Search + Filtering
- admin.html                    → Admin CMS (mocked login — any email/password works)

## IMPORTANT — what this bundle is and isn't
This IS: the full approved design, real animation, real interactivity,
safe to show clients or the public as a preview.

This IS NOT: connected to a real database. The admin login is not secure,
"Save & Publish" doesn't persist anywhere, and only one biography (Tesla)
has full content — everything else is mock data. Do not treat this as
your real production website; treat it as the approved visual/UX spec.

## To make this a REAL production website
The real backend groundwork already exists from Phase 1 (Next.js +
Supabase scaffold, delivered earlier as lifelegends-phase1.zip). Turning
this demo into production means:
1. Create a real Supabase project (free tier is fine) — get a URL + anon key.
2. Wire supabase.auth.signInWithPassword into admin.html's login (or,
   properly, migrate this HTML into the Next.js Phase 1 project's
   component structure).
3. Create the `legends`, `categories`, `timeline_events` etc. tables per
   the approved SDD §7.4 schema, with Row Level Security policies.
4. Replace the mock `db` object in admin.html with real Supabase queries.
5. Deploy the Next.js app (not this static bundle) to Vercel, with the
   Supabase URL/keys as environment variables.

I can do all of #1–5 with you directly if you'd like — I'd need you to
create the free Supabase project (I can walk you through it) since I
can't provision cloud accounts on your behalf.
