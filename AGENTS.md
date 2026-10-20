# AGENTS.md

## UI code standards (enforced via skills)

This repo has project skills in `.agents/skills/` that govern all work. Load and follow them:

- **`feature-process`** — for **every** change, before the first line of code: issue, branch, gates, pull request. `main` only moves through a PR. CI here builds `frontend/app` and `frontend/home` only, so a green check is not the gate.
- **`modular-ui-authoring`** — when **writing new** React/Next.js components, pages, or views. New UI must be modular from the start: typed hooks, `*.types.ts` / `*.constants.ts` files, <80-line component files, RSC-first with `'use client'` on the smallest leaf only.
- **`modular-ui-refactor`** — when **changing existing** UI structure. Zero behavior changes; public import paths and export styles are contracts; tour-targeted IDs (`#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library`) are load-bearing.
- **`design-enforcement`** — for **all** styling. `DESIGN.md` is the single source of truth: semantic tokens only, light/dark class pairs, no raw hex, compose from `components/ui/` via `cn()`.
- **`apple-design`** — for motion and feel: the seek scrubber, volume, drawers, sheets, springs, momentum, reduced motion. It governs behaviour of an interaction, never its look.
- **`ask-sonner`** — for toasts, which here means mint, buy and upload progress. One `Toaster` per app, and the loading-toast-id pattern is the house style.
- **`break-ui`** — before trusting a surface that renders artist text, chain numbers or addresses. Worst-case data, not demo data.
- **`thermo-nuclear-code-quality-review`** — for deep maintainability work, and whenever a change would duplicate something that already exists in the other app.
- **`check-compiler-errors`** — before reporting any code change as done. Five gates, plus the Aiken PTY trap.
- **`seo-sem` / `seo-sem-enforcement`** — for metadata, structured data, sitemaps, and internal linking in `frontend/home` and `frontend/app`.
- **`skill-gardening`** — for maintaining the skills themselves. When you make a mistake, the user corrects you, you discover an undocumented convention, or standards change, update the owning skill in the same session.

### Skill ownership (each rule lives in exactly one place)

| Concern | Owning skill |
| --- | --- |
| The change workflow: issue, branch, gates, PR | `feature-process` |
| Structure of **new** UI code | `modular-ui-authoring` |
| Restructuring **existing** UI, behavior preservation | `modular-ui-refactor` |
| Composition of dashboards, overviews and operator screens | `dashboard-ui` |
| Styling, tokens, design system | `design-enforcement` (source of truth: `DESIGN.md`) |
| Motion, gestures, player and sheet feel | `apple-design` |
| Toasts and transaction progress feedback | `ask-sonner` |
| Worst-case data and edge cases in a surface | `break-ui` |
| Deep maintainability review, deduplication | `thermo-nuclear-code-quality-review` |
| Compile and type-check gates | `check-compiler-errors` |
| Metadata, structured data, internal linking | `seo-sem` |
| How/when to edit skills | `skill-gardening` |

If a rule feels needed in two skills, put it in the owning skill and cross-reference it from the other. Keep each skill inside its stated concern — split rather than bloat.

## Repository layout

- `frontend/app` — Next.js 16 App Router app (alias `@/*` → `./*`, TypeScript strict, Tailwind v3, bun).
- `frontend/home` — Vite + React SPA marketing site. **Not Next.js**: no `next/image`, `next/link`, or RSC conventions here.
- `frontend/app/backend/core-api` — Bun API service backing the app.

## Verification gates

- In `frontend/app`: `bunx tsc --noEmit` must stay clean. Run `bun run build` after non-trivial UI changes, but **ask before starting the build** — do not run it automatically.
- `bun run lint` is currently broken repo-wide (no ESLint config) — typecheck + build are the gates until it's fixed.
