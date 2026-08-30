# AGENTS.md

## UI code standards (enforced via skills)

This repo has project skills in `.agents/skills/` that govern all UI work. Load and follow them:

- **`modular-ui-authoring`** — when **writing new** React/Next.js components, pages, or views. New UI must be modular from the start: typed hooks, `*.types.ts` / `*.constants.ts` files, <80-line component files, RSC-first with `'use client'` on the smallest leaf only.
- **`modular-ui-refactor`** — when **changing existing** UI structure. Zero behavior changes; public import paths and export styles are contracts; tour-targeted IDs (`#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library`) are load-bearing.
- **`design-enforcement`** — for **all** styling. `DESIGN.md` is the single source of truth: semantic tokens only, light/dark class pairs, no raw hex, compose from `components/ui/` via `cn()`.
- **`seo-sem` / `seo-sem-enforcement`** — for metadata, structured data, sitemaps, and internal linking in `frontend/home` and `frontend/app`.
- **`skill-gardening`** — for maintaining the skills themselves. When you make a mistake, the user corrects you, you discover an undocumented convention, or standards change, update the owning skill in the same session.

### Skill ownership (each rule lives in exactly one place)

| Concern | Owning skill |
| --- | --- |
| Structure of **new** UI code | `modular-ui-authoring` |
| Restructuring **existing** UI, behavior preservation | `modular-ui-refactor` |
| Styling, tokens, design system | `design-enforcement` (source of truth: `DESIGN.md`) |
| Metadata, structured data, internal linking | `seo-sem` |
| How/when to edit skills | `skill-gardening` |

If a rule feels needed in two skills, put it in the owning skill and cross-reference it from the other. Keep each skill inside its stated concern — split rather than bloat.

## Repository layout

- `frontend/app` — Next.js 16 App Router app (alias `@/*` → `./*`, TypeScript strict, Tailwind v3, bun).
- `frontend/home` — Vite + React SPA marketing site. **Not Next.js**: no `next/image`, `next/link`, or RSC conventions here.
- `backend/` — Go backend.

## Verification gates

- In `frontend/app`: `bunx tsc --noEmit` must stay clean. Run `bun run build` after non-trivial UI changes, but **ask before starting the build** — do not run it automatically.
- `bun run lint` is currently broken repo-wide (no ESLint config) — typecheck + build are the gates until it's fixed.
