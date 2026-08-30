---
name: modular-ui-refactor
description: Refactor React/Next.js UI source files into strict modular, maintainable, accessible code — hooks, types, constants, and <80-line subcomponents — with zero behavior changes and stable public import paths
type: prompt
whenToUse: When the user asks to refactor, split, or modularize React/Next.js UI components, pages, or views into smaller files, extract hooks/types/constants, or enforce the <80-line component rule
---

# Modular UI Refactor

Transform large React/Next.js UI files into small, single-responsibility modules. Behavior preservation outranks every other rule: a refactor that changes what the UI does is a failed refactor.

## Phase 0 — Recon (never skip)

1. **Confirm the framework before applying framework rules.** This repo has both a Next.js App Router app (`frontend/app`) and a Vite SPA (`frontend/home`) — `next/image`, `next/link`, RSC defaults, and App Router conventions apply ONLY to Next.js. For Vite, apply the same modularity principles but keep React Router and plain `<img>`/`<a>`.
2. **Check project conventions:** path aliases (`@/*` → `./*` in `frontend/app`), Tailwind version, code style (tabs vs spaces, quotes), and existing refactored modules to use as the in-repo pattern (e.g. `track/[id]/components/`).
3. **Map consumers first.** Grep for every import of each target file. Catalogue the full export surface (default vs named, hooks, types). Every exported symbol must remain importable from its current path after the refactor.
4. **Establish a verification baseline:** run `bunx tsc --noEmit` (in `frontend/app`) before touching anything, so pre-existing errors are distinguishable from introduced ones.

## Phase 1 — Extraction rules

1. **Non-render concerns** (state, event handlers, side effects, derived logic, API calls) → custom hooks in `use[ComponentName].ts`, each exporting a typed return interface (`export interface UseComponentNameReturn { ... }`).
2. **Distinct UI sections** (header, toolbar, list, card, modal, form, footer, list item) → separate subcomponents with explicit props interfaces. Duplicated JSX blocks become ONE subcomponent parameterized by a literal-union prop (e.g. `variant: 'collected' | 'single' | 'album'`).
3. **Static types** → `[ComponentName].types.ts`; **static values** → `[ComponentName].constants.ts`.
4. **File brevity:** every UI component file < 80 lines. Split further when exceeded. Hooks and types live in separate files; cohesive hooks may exceed 80 lines when splitting would lose cohesion (note it in the report).

## Phase 2 — Layout and stability rules

- **The original file stays at its path** as the composed parent (or a barrel re-export for infrastructure modules like `Providers.tsx`), keeping its exact export style (default vs named) and props signature. Extracted parts go in a sibling kebab-case subfolder (`components/connect-header/`), imported relatively.
- **Server vs client (Next.js only):** default to RSC (no `'use client'`); add `'use client'` as the very first line only of files needing state, handlers, or browser-only effects. Root layouts and pages with `metadata`/`viewport` must stay server components — those exports must remain literal in-file for Next's static analysis.
- **TypeScript:** strict, explicit interfaces for all props and hook returns. No new `any`/`unknown`. Tighten existing loose typing only where consumers still compile (`catch (e: any)` → `catch (e)` + `instanceof Error` narrowing is safe).

## Phase 3 — Preservation rules (zero behavior changes)

- Preserve verbatim: JSX structure, classNames, element IDs (tour-targeted IDs like `#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library` are load-bearing), aria attributes, handlers, conditional rendering, storage keys, provider nesting order, debounce/timing constants, toast messages, chart configs, and all blockchain/Web3 logic.
- Allowed changes: dead-code removal (unused imports/variables), type-safe narrowing, `next/image`/`next/link` swaps only where behavior-safe (skip for dynamic/unconfigured remote URLs or runtime data-URIs).
- Accessibility additions (labels, semantic elements) only where they don't alter visuals.
- Respect the design-enforcement skill: never restyle during a refactor.

## Phase 4 — Execution at scale

- **Batch, don't dump.** For more than a few files, work in batches of coupled files (e.g. a grid + its card), writing changes directly to files — not giant code-block dumps. Parallelize independent batches.
- **Exclusions:** vendored primitives (`components/ui/*` shadcn), `opengraph-image.tsx` ImageResponse templates, and files that must keep metadata literal.

## Phase 5 — Verification and report

- `bunx tsc --noEmit` must match the baseline (exit 0), then run the production build (`bun run build`) after the final batch.
- Report per file: original → new file mapping with line counts, plus a behavior-changes list (expected: zero, plus any dead-code removals).
- Known gap in this repo: `bun run lint` is broken (no ESLint config) — typecheck + build are the gates.
