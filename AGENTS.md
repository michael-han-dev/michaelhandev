# AGENTS.md

Personal portfolio for michaelhandev. Next.js 15 App Router + TypeScript + Tailwind v4 + framer-motion, deployed on Vercel.

## Commands

```bash
npm run dev          # dev server on :3000 (Turbopack)
npx tsc --noEmit     # typecheck — THE verification step
npm run build        # production build
```

- There are **no tests**.
- `npm run lint` does not work: ESLint is not installed/configured (`next lint` prompts interactively). Use `npx tsc --noEmit` instead.

## Environment variables

- `.env` (present): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required by `utils/supabase.ts`; without them image queries fail silently (errors are logged, empty arrays returned).
- `.env.local` (not committed): `GITHUB_TOKEN`, `GITHUB_USERNAME` — required by `app/api/github-contributions/route.ts`. Without `GITHUB_TOKEN` that API returns 500 and the home-page footer contributions line (`components/ContributionsLine.tsx`) silently renders nothing. Setup guide: `GITHUB_SETUP.md`. Same vars must be set in Vercel for prod.
- Never commit token/key values.

## Content model (three separate sources — easy to miss)

1. **Metadata** lives as hardcoded typed arrays in `data/articles.ts`, `data/projects.ts`, `data/experience.ts`. Edit these to add/change items.
2. **Blog post bodies** are markdown files in `public/blog-content/<slug>.md`, fetched at *runtime* from the browser via relative URL and rendered with `marked` (`lib/blog.ts`). Adding a post requires BOTH an entry in `data/articles.ts` AND a matching file. Slugs/filenames are case-sensitive (e.g. slug `Hyperloop` → `Hyperloop.md`).
3. **Images** are NOT local assets — they live in a Supabase table `images`, keyed by `usage` (`'blog' | 'project' | 'experience'`) + `related_id` matching the item's `id` in `data/`. Queried via helpers in `lib/images.ts`.

## Structure quirks

- **Design system** lives in `app/globals.css` (token block + primitives: `.font-display`, `.eyebrow`, `.meta`, `.link-inline`, `.hairline-t`, `.page-enter`). Light paper theme, radius 0, no shadows/glows; muted blue accent for links/active only. Fonts load via `next/font` in `app/layout.tsx`: Geist Sans (body), Geist Mono (metadata), Outfit (`--font-display`, used by the masthead wordmark; chosen as the closest open stand-in for Google Sans). Build pages from `components/Ledger.tsx` (`LedgerSection`/`LedgerRow`) and `components/Masthead.tsx`. The `text-slate-*` override block in globals.css is a TEMPORARY migration shim — delete it once every page is rebuilt on the system.
- `app/ai/*` mirrors every main page (`writing`, `projects`, `experience`, `blog/[slug]`) as a plain-text/terminal-styled version meant for copy-paste and LLM consumption. When changing page content, check whether the `/ai/` twin needs the same update.
- All pages are `'use client'` components doing client-side fetching; don't assume server components or SSG data loading.
- Tailwind v4 CSS-first setup: theme tokens and custom utility classes (`bg-main`, `bg-card-light`, `bg-card-lighter`) are defined in `app/globals.css` via `@theme`/plain CSS, not in `tailwind.config.js`.
- MDX is configured in `next.config.ts` (`pageExtensions`) but currently unused — no `.mdx` pages exist.
- Path alias `@/*` maps to the repo root (`@/components/...`, `@/lib/...`, `@/data/...`).
