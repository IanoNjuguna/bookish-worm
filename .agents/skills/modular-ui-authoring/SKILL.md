---
name: modular-ui-authoring
description: Write new React/Next.js UI code modular from the start — typed hooks, types/constants files, <80-line components, RSC defaults — so it never needs a modularity refactor later
type: prompt
whenToUse: When the user asks to create, build, scaffold, or add a new React/Next.js component, page, view, or UI feature in this repository
---

# Modular UI Authoring

Write new UI code in its final modular shape from the first commit. The structure enforced here is identical to what `modular-ui-refactor` produces — code written this way never needs that refactor. If you are changing existing UI instead, use `modular-ui-refactor`; also follow `design-enforcement` for all styling.

## Before writing anything

1. **Confirm the target app:** `frontend/app` is Next.js 16 App Router (alias `@/*` → `./*`); `frontend/home` is a Vite SPA — no `next/image`, `next/link`, or RSC rules there.
2. **Find the in-repo pattern** for the feature you're adding and match it (e.g. `track/[id]/components/`, `components/song-card/`): folder naming (kebab-case subfolder per feature), export style, code style (tabs vs spaces, quotes).
3. **Verify dependencies before importing them** — check `package.json`; never assume a library exists.

## File structure for any non-trivial component

A component with state, handlers, or more than one visual section is a **module**, not a file:

- `components/<feature-name>/` — kebab-case subfolder holding the parts
- `[ComponentName].types.ts` — all props interfaces and shared types, exported explicitly
- `[ComponentName].constants.ts` — static values (keys, endpoints, timings, copy constants)
- `use[ComponentName].ts` — all non-render logic (state, effects, handlers, derived values, fetching), exporting a typed return interface (`UseComponentNameReturn`)
- Subcomponents — one per distinct UI section, each with an explicit props interface
- The public file (e.g. `components/ComponentName.tsx`) — a thin composed parent wiring hook → subcomponents

## Hard rules

- **< 80 lines per UI component file.** If a draft crosses the limit, split before writing more — don't finish and plan to refactor later.
- **No inline logic in JSX.** Derived values, formatting, and conditionals beyond trivial ternaries belong in the hook or a named function.
- **Strict TypeScript:** explicit interfaces for every props object and hook return. No `any`/`unknown`; narrow unions and literal types over loose shapes.
- **Server-first (Next.js only):** start every component as an RSC. Add `'use client'` (very first line) only to the smallest leaf that actually needs state, handlers, or browser APIs. Pages and layouts keep `metadata`/`viewport` exports literal in-file.
- **Stable public API:** choose default vs named export to match neighboring modules; once imported elsewhere, the path and export style are a contract.
- **Accessibility from the start:** semantic elements (`nav`/`main`/`section`/`article`), form labels, aria attributes, visible focus rings, alt text — not a later pass.
- **Every async surface gets loading, empty, and error states**, with skeletons matching the layout shape.
- **`next/image` / `next/link`** for images and anchors in Next.js (with configured remote patterns); plain elements in the Vite app.

## Definition of done for new UI code

1. Every UI file < 80 lines; logic in hooks; types/constants in their own files.
2. `bunx tsc --noEmit` clean (in `frontend/app`).
3. No new `any`, no string-concatenated classNames (use `cn()` from `@/lib/utils`), no raw hex colors, every color class paired with its `dark:` variant.
4. Tour-targeted IDs (`#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library`) used only for their established purpose — never renamed or duplicated.
