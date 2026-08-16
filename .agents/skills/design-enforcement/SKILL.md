---
name: design-enforcement
description: Enforce the Doba design system (DESIGN.md) when writing, modifying, or reviewing UI code in frontend/app or frontend/home
type: prompt
whenToUse: When the user asks to write, modify, or review UI/frontend code (components, pages, styles, Tailwind classes) in this repository
---

# Design Enforcement

`DESIGN.md` at the repository root is the single source of truth for UI/UX. Read it before doing UI work. Apply these rules to every component, page, or style you write or review:

## Tokens & Color
- Use semantic/token classes only: `cyber-pink`, `lavender`, `midnight`, and `hsl(var(--…))`-backed utilities (`bg-primary`, `text-muted-foreground`, `border-border`, …). Never introduce raw hex colors in components.
- Every color class comes in a light/dark pair (`text-midnight dark:text-white`, `bg-midnight/5 dark:bg-white/5`). If you write a color without a `dark:` variant, stop and add one.
- Stay within the white-opacity ladder `/20`–`/80`; `frontend/app/app/globals.css` force-remaps dark-mode opacities for contrast. No new `!important` rules outside the existing dark-contrast and `:lang()` font overrides.

## Shape & Surface (rounded glass system)
- Radii come from `--radius: 0.75rem`: buttons/inputs `rounded-md`–`rounded-lg`, cards/panels `rounded-2xl`, avatars/icon wells `rounded-full`.
- Panels and cards use `.glass-surface` (or `.glass-surface-hover` when interactive). `.glass` is a legacy alias — do not use it in new code.
- The old angular system is retired: reject any `clip-angular-*`, `clip-hexagon`, `clip-diamond`, `clip-tag`, or `rounded-none` in new or touched code. The utilities no longer exist in `frontend/app/app/globals.css`.

## Components & Behavior
- Compose from `components/ui/` primitives (Button, Input, Dialog, DropdownMenu, Checkbox, Sheet, Skeleton) via `cn()` from `@/lib/utils` before writing custom markup. Never string-concatenate classNames.
- Buttons keep the shadcn focus ring (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`; `ring-lavender` on app inputs). Never strip focus styles without a visible replacement.
- Async feedback goes through `sonner` (`toast.success` / `toast.error`). Loading buttons show a verb + ellipsis and set `disabled`. No other toast library.
- Icons come from `@tabler/icons-react` only. `framer-motion` only in `frontend/app`; never in `frontend/home`.
- Dialogs/dropdowns rely on Radix for focus trap and keyboard handling — do not hand-roll it; overriding Escape/outside-click must be a commented exception.
- Keep tour-targeted element IDs stable: `#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library`.

## Layout & Motion
- Mobile-first, breakpoints limited to `sm` / `md` / `lg`; the dashboard pivots at `lg`. Z-index ceiling is `z-[60]` (menus), overlays at `z-50`.
- Motion scale: micro `duration-150`–`200`, standard `duration-300 ease-out`, structural `duration-500`. Reuse existing keyframes before adding new ones.

## When reviewing
Flag violations as: **[design] rule broken — file:line — expected pattern from DESIGN.md**. If code and DESIGN.md genuinely disagree, say so and propose updating DESIGN.md rather than drifting silently.
