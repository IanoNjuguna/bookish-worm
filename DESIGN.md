# DESIGN.md — Systemic UI/UX & Component Architecture

> **Core Visual Ethos:** Rounded glass, dark-mode-first, cyber-pink energy — one unified design system across every Doba surface. Corners are soft (`--radius: 0.75rem`), surfaces are translucent glass with backdrop blur, cyber-pink (`#FF1F8A`) is the action color, lavender (`#B794F4`) is the accent. Nothing is decorative that isn't also a state signal.

This document is the single source of truth for UI work across both frontends, which share **one design system**:

| Surface | Path | Stack | Role |
|---|---|---|---|
| **App** (marketplace/studio, `app.doba.world`) | `frontend/app` | Next.js, Tailwind, next-intl, Radix/shadcn primitives | Product dashboard |
| **Home** (marketing, `doba.world`) | `frontend/home` | Vite + React, Tailwind, shadcn-style primitives | Marketing site |

Shared stack: Tailwind `darkMode: 'class'`, `tailwindcss-animate`, `cn()` (clsx + tailwind-merge), `@tabler/icons-react`, `sonner` toasts, `class-variance-authority`, Chivo / Space Mono / IBM Plex Mono, `--radius: 0.75rem`, and the `.glass-surface` component family.

---

## 1. Visual Foundation & Design Tokens

### Color System

**Brand (both apps):**
- `cyber-pink` `#FF1F8A` — primary action, active nav state, collect/buy triggers. CSS var `hsl(330 100% 56%)` in `home`; hardcoded hex token in `app/tailwind.config.ts` (use the `cyber-pink` class, never the raw hex).
- `lavender` `#B794F4` — secondary CTA (e.g. Sign In), section labels, scrollbar accents. CSS var `hsl(263 85% 77%)` in `home`; hex token in `app`.
- `midnight` `#0D0D12` — app token; dark background base and light-mode text color (`text-midnight`).

**Semantic tokens (CSS variables, consumed as `bg-primary`, `text-muted-foreground`, etc.):**

| Token | App light / dark | Home light / dark |
|---|---|---|
| `--background` | `60 33% 98%` (#FAF9F6) / `0 0% 3.9%` | `60 33% 98%` / `240 10% 5%` |
| `--foreground` | `240 18% 6%` / `0 0% 98%` | `240 10% 5%` / `0 0% 100%` |
| `--primary` | `310 98% 51%` / same | `330 100% 56%` / same |
| `--card` / `--popover` | `0 0% 100%` / `240 10% 7%` | `0 0% 100%` / `240 10% 7%` |
| `--muted-foreground` | `0 0% 45.1%` / `0 0% 70%` | `240 10% 40%` / white 40% |
| `--destructive` | `0 84.2% 60.2%` / `0 62.8% 30.6%` | `0 84.2% 60.2%` / same |
| `--border` / `--input` | `0 0% 89.8%` / `0 0% 15%`, `0 0% 10%` | `240 10% 90%` / white 8% |
| `--ring` | `310 98% 51%` | `330 100% 56%` |
| `--chart-1..5` (app only) | pink → purple → blue → violet → magenta | — |
| `--sidebar-*` (app only) | full shadcn sidebar scale | — |

- **Glass surfaces (both apps, unified):** `.glass-surface` = `backdrop-blur-xl rounded-2xl border` over `rgba(13,13,18,0.06)` / `rgba(13,13,18,0.12)` border in light mode and `rgba(255,255,255,0.02)` / `rgba(255,255,255,0.08)` in dark. In `home` these values come from `--glass-bg` / `--glass-border` tokens; in `app` they are defined directly in `globals.css`. `.glass` is the app's legacy alias of `.glass-surface` — prefer `.glass-surface` in new code.
- **Backgrounds (unified):** both apps render the same ambient background recipe — flat Paper/Midnight base plus a lavender gradient band and blurred cyber-pink/lavender orbs — via `VantaBackground` (`frontend/home/src/components/doba/VantaBackground.tsx`, ported to `frontend/app/components/VantaBackground.tsx`). The app's body rule is a flat `bg-background` / `dark:bg-midnight`; the old multi-layer CSS gradient was removed. `.bg-premium-gradient` (app) remains for deep panels.
- **Text hierarchy (app):** `text-midnight dark:text-white` (primary), `/80`-`/70` (secondary), `/60`-`/50` (muted), `/40` (subtle). Both light-mode `text-midnight` and dark-mode `text-white` opacities `/20`–`/70` are **force-remapped for contrast** in `frontend/app/app/globals.css` — do not fight this with `!important` elsewhere.
- **Text hierarchy (home):** `text-zinc-900 dark:text-white` primary, `text-zinc-600 dark:text-zinc-400` body, `text-zinc-500` muted.
- **Status:** destructive red above; **collected/success is `emerald-500`** (collected badges, pipeline completion). **Playing indicators, thin strokes, and small icons (DobaVisualizer, equalizer bars, checkmarks, headphone icons, hover accents, progress fills) are theme-aware: `pink-600` in light mode, `cyber-pink` in dark** — flat cyber-pink on Paper is only ~3.4:1 and reads washed-out on thin strokes. Upload-pipeline stages use `fuchsia-500` / `purple-500` / `blue-500` / `emerald-500`. Info uses `text-lavender`; warnings use `text-red-400`. Third-party brand marks keep their official hexes (Google `#4285F4`, Discord `#5865F2`).

### Typography

- **Sans:** Chivo (`font-sans`) — all UI text. App loads via `next/font` as `--font-chivo`; home imports from Google Fonts.
- **Display:** Space Mono (`font-display`) — hero/brand moments.
- **Mono:** IBM Plex Mono (`font-mono`) — addresses, seed phrases, hashes, code.
- **Non-Latin scripts (app):** Noto Sans KR/JP/SC/Thai/Arabic/Hebrew forced via `:lang()` rules with `!important` (`frontend/app/app/globals.css`). Space Mono lacks these glyphs — never remove these overrides.
- **Scale in practice:**
  - Hero: `text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black` (home)
  - Page title: `text-4xl sm:text-5xl font-black tracking-tight`
  - Section: `text-2xl sm:text-3xl font-bold`
  - Card title: `text-xl font-bold` / `text-sm sm:text-base font-bold`
  - Body: `text-sm font-medium leading-relaxed`
  - Caption/label: `text-xs`; nav section labels: `text-[9px] font-bold uppercase tracking-[0.15em] text-lavender`
  - Buttons: `text-sm font-medium` (primitive), `font-bold`/`font-extrabold` for CTAs

### Spacing, Radius & Elevation

- **Spacing:** default Tailwind 4px scale. Recurring shell padding: `px-4 sm:px-6 lg:px-8`; card padding `p-5 sm:p-6` (home), `p-6` (app content `p-6 pb-28 md:pb-8`); section gaps `space-y-6` / `space-y-10`.
- **Radius (unified):** `--radius: 0.75rem` in both apps. Scale: `rounded-lg` = `var(--radius)`, `rounded-md` = `calc(var(--radius) - 2px)`, `rounded-sm` = `calc(var(--radius) - 4px)`; `rounded-xl`/`2xl` remain on the default Tailwind scale. Conventions: buttons/inputs `rounded-md`–`rounded-lg`, cards/glass surfaces `rounded-2xl`, avatars/icon wells `rounded-full`.
  - **Deprecated:** the app's old angular system (zero radii, `clip-angular-*`, `clip-hexagon`, `clip-diamond`, `clip-tag`, `rounded-none`) was removed in the glass-system migration. Do not reintroduce clip-path shaping or `rounded-none`.
- **Shadows/elevation (app):** `shadow-pink-glow` (`0 8px 24px rgba(255,31,138,0.15)`), `shadow-card-glow`, `shadow-xl` on empty states; elevation is primarily communicated by glass borders.
- **Shadows (home):** `shadow-lg dark:shadow-2xl` on floating nav; `--glow-pink` / `--glow-pink-hover` vars.
- **Shared hover elevation:** `.glass-surface-hover` = glass surface + pink glow + border brightening on hover (`transition-all duration-500`).
- **Z-index:** header `z-50`; mobile menu `z-[60]`; Radix overlays `z-50`. Keep overlays at 50 and menus above at 60; do not introduce new layers above 60.

---

## 2. Layout & Responsive Architecture

- **Breakpoints (default Tailwind, actively used):** `sm` 640, `md` 768, `lg` 1024. The app is **mobile-first with an `lg:` desktop pivot** — the entire dashboard shell (sidebar, blur header) switches at `lg`. Mobile menu pattern: `lg:hidden` fixed overlay under a `top-16` header.
- **Containers:**
  - App content: `max-w-7xl mx-auto` inside a scrollable `<main>`.
  - Home pages: `max-w-4xl` (text pages) / `max-w-6xl` (hero, navbar).
  - Tailwind `container` (home only): centered, `padding: 2rem`, `2xl: 1400px`.
- **App shell (`DashboardLayoutClient.tsx`):** `h-[100dvh]` column of floating frosted-glass pills over the ambient background — **header** (`fixed top-3 left-3 right-3 lg:top-4 lg:left-6 lg:right-6 h-16`), **left sidebar** (`m-4 mr-0`, collapsible `w-[20vw] min-w-[190px] max-w-[240px]`), and **audio player** (inset `bottom-3 left-3 right-3` mobile / `md:mx-4 md:mb-4` desktop) all share one recipe: `glass-surface bg-background/60 dark:bg-midnight/50 rounded-2xl shadow-xl`. Shell regions carry no edge borders or full-bleed slabs; content offsets are `mt-20 lg:mt-24`. The now-playing panel and mobile menu are pills too (`inset-y-3 right-3` drawer / `inset-x-3 top-20 bottom-3` sheet). Collapsible panels animate with **fixed pixel widths** (`w-60` sidebar, `w-80` panel → `w-0`) over `duration-300 ease-in-out`, and **margins toggle with visibility** (`m-4 mr-0` / `lg:m-4 lg:ml-0` ↔ `m-0`) so collapsed pills leave no stray gap; `overflow-hidden` clips content during the transition.
- **Home shell:** absolutely-positioned floating navbar (`top-4 sm:top-6`, glass pill) over full-bleed sections with `VantaBackground`.
- **Nav active state (app):** `text-cyber-pink font-bold bg-cyber-pink/5 dark:bg-cyber-pink/10`; no left indicator line — the tinted background + pink text/icon mark the active item (`SidebarNavLink`).
- **Dividers:** standalone hairlines are feathered gradient rules with rounded caps — `h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent` (header, audio player, sidebars). Structural shell edges (left sidebar, now-playing panel) use the vertical variant `w-[1px] rounded-full bg-gradient-to-b from-transparent via-midnight/[0.06]…` as an internal absolute rule — never container `border-r`/`border-l`/`border-t` on shell regions, so collapse animations clip the rule cleanly. In-card separators use `border-t border-midnight/[0.06] dark:border-white/[0.06]` (or `dark:border-white/5`). Never hard-cut, full-strength divider lines — they read as angular against the glass surfaces.
- **Grids:** card grids use responsive `grid-cols-*` with `gap-*`; forms are single-column `flex flex-col gap-4`; labels sit above inputs.

---

## 3. Core Component Library Standards

Both apps carry shadcn-style primitives (`cva` + Radix) under `components/ui/`. **Always compose from these; do not hand-roll new primitives.**

### Buttons & Action Triggers
- Primitive (`ui/button.tsx`, identical in both apps): base = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4`.
- Variants: `default` (bg-primary), `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default h-10 px-4`, `sm h-9 px-3`, `lg h-11 px-8`, `icon h-10 w-10`.
- **CTA overrides (established convention):**
  - Primary action: `bg-cyber-pink hover:bg-cyber-pink/90 text-white font-bold h-12` (AuthModal "Finish Setup")
  - Secondary action: `bg-lavender hover:bg-lavender/90 text-midnight font-bold h-10 px-6` (Sign In)
  - Ghost cancel: `variant="ghost"` with `text-midnight/70 dark:text-white/40`
- **Glass CTAs (both apps):** `.glow-button` (lavender fill, `hover:-translate-y-1px`), `.outline-button` (glass surface) — defined in each app's global CSS.
- Loading state: swap label to a verb + ellipsis (`'Verifying...'`, `'Connecting...'`) and set `disabled`; spinners use `IconLoader2` with `animate-spin`.

### Form Controls & Inputs
- `ui/input.tsx`: `h-10 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50`.
- App overrides inputs to `bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 focus-visible:ring-lavender`.
- Labels: `<label htmlFor>` above the field, `text-sm font-medium`; helper text `text-xs text-midnight/70 dark:text-white/50`; errors `text-red-400 text-xs font-medium mt-2 ml-1` (inline, below field).
- Checkboxes: `ui/checkbox.tsx` with `data-[state=checked]:bg-lavender data-[state=checked]:border-lavender`.

### Cards & Content Containers
- **Unified glass card:** `.glass-surface` (or `.glass-surface-hover` when interactive) with `p-5 sm:p-6`; marketing sections use `p-6 sm:p-8`. Artwork hover zooms `group-hover:scale-105 transition-transform duration-500`.
- 3D flip cards (app) use `.perspective-1000` / `.preserve-3d` / `.backface-hidden` / `.rotate-y-180`.
- Track/release cards (`SongCard.tsx`) support hover, long-press, and expanded states — follow its state naming (`isHovered`, `isLongPressed`, `isExpanded`).

### Feedback & Overlays
- **Modals:** Radix `Dialog` (`ui/dialog.tsx`) — zoom/fade entrance `data-[state=open]:zoom-in-95 fade-in-0 duration-200`, `sm:max-w-md` content, surfaces `bg-background dark:bg-card border-midnight/10 dark:border-white/10`. AuthModal blocks pointer-down-outside and Escape for forced flows (a deliberate, commented exception).
- **Dropdowns:** Radix `DropdownMenu`, items `p-3 hover:bg-midnight/5 dark:hover:bg-white/5`, section labels `text-[10px] uppercase tracking-widest`.
- **Toasts:** `sonner` in both apps — `toast.success(...)`, `toast.error(...)`. No other toast library.
- **Tooltips:** `ui/tooltip.tsx` (Radix) in home; app mostly uses native `title=` + `aria-label`.
- **Drawers/sheets:** `ui/sheet.tsx` (app) — `ease-in-out`, `data-[state=open]:duration-500`, closed `duration-300`.
- **Skeletons & loading states:** content placeholders always use the `Skeleton` primitive (`ui/skeleton.tsx`) — `animate-pulse glass rounded-md` by default; override the radius to mirror the content shape (rows `rounded-xl`, cards `rounded-2xl`, avatars `rounded-full`) and set only size via `className`. Inline ad-hoc placeholders (`bg-midnight/5 … animate-pulse` divs) are banned. Spinners are for full-route loads and inline button waits only, always `IconLoader2` with `animate-spin text-pink-600 dark:text-cyber-pink` — CSS border-hack spinners (`border-t-transparent`) are banned. `animate-pulse` outside loading is reserved for live-state signals (DobaVisualizer, playing indicators).
- **Empty states:** centered glass panel `p-12 text-center` with a stable `id` (e.g. `#library-empty-state` in MyStudioGrid), heading `text-xl font-semibold`, CTA below. Keep these IDs stable — they are reserved anchors for the onboarding flow (currently being rebuilt).

---

## 4. State Management & Micro-Interactions

- **Focus rings:** global standard is the shadcn ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` (app inputs override to `ring-lavender`). Never remove focus styles without a visible replacement.
- **Keyboard navigation:** delegated to Radix primitives (dialogs, dropdowns, checkboxes handle focus trap/arrow keys). Custom buttons must stay real `<button>` elements — see `ThemeToggle`, menu triggers.
- **Theme toggling:** app uses `next-themes` (`ThemeToggle` → `useTheme()`); home uses a custom toggle persisting `doba-home-theme` in localStorage, **dark by default**. Both drive the `dark` class on `<html>`.
- **Motion timings (observed):**
  - Micro (hover, color): `duration-150`–`duration-200`, `transition-colors`
  - Standard UI: `duration-300 ease-out` (toasts, menus, icon swaps, `animate-fade-in`, `animate-slide-in-*`)
  - Page/structural: `duration-500` (sidebar collapse, card hovers, sheet open, `.glass-surface-hover`)
  - Ambient loops: `animate-pulse-glow 3s`, `float 6s`, `shimmer 8s`, `equalizer 1.07s` (audio visualizer)
  - Icon cross-fade pattern: absolute-stacked icons toggling `opacity/rotate/scale` over `duration-300` (menu ↔ close)
- **Keyframes available:** app — `accordion-*`, `pulse-pink`, `pulse-scale`, `fadeIn`, `slideIn{Left,Right,Down}`, `slideUpSpring`, `marquee-*`, `equalizer`; home — `accordion-*`, `fade-up`, `pulse-glow`, `float`, `blink`, `shimmer`.
- **framer-motion** is a dependency of `frontend/app` only — use it for complex orchestration; CSS keyframes for everything simple. Home has no framer-motion; do not add it.
- **Sliders & progress bars:** track, fill, and scrubber are always fully rounded — `h-[3px] … rounded-full` track/fill, `w-3 h-3 rounded-full border border-midnight/10` scrubber (visible on `group-hover`). Volume track is theme-aware (`bg-midnight/10 dark:bg-white/20`). Never square-ended fills.
- **Scrollbars:** hidden app-wide, all breakpoints (`::-webkit-scrollbar { display: none }` + `scrollbar-width: none` in `frontend/app/app/globals.css`). Scrolling still works — wheel, touch, keyboard — the chrome just never renders. `.custom-scrollbar` survives as an opt-in mini-scrollbar; do not add new visible scrollbar styling.
- **Empty & error states:** empty = glass panel + heading + CTA (above). Network/tx errors go to `toast.error(formatTxError(...))`; destructive inline errors in red (`text-red-400`). Marquee overflows degrade gracefully (`.marquee-container` mask).

---

## 5. Development Enforcement Rules (Do's and Don'ts)

**DO:**
- Use `cn()` from `@/lib/utils` to merge conditional classes — never string-concatenate classNames.
- Compose from `components/ui/` primitives (Button, Input, Dialog, DropdownMenu, Checkbox, Sheet, Skeleton) before writing custom markup, and use `.glass-surface` / `.glass-surface-hover` for panels and cards.
- Write every color as a light/dark pair (`text-midnight dark:text-white`, `bg-midnight/5 dark:bg-white/5`) and test both themes; the app force-remaps dark white-opacities for contrast — stay within the `/20`–`/80` ladder.
- Use `sonner` (`toast.success/error`) for all async feedback, and keep loading labels as verb + ellipsis on a `disabled` button.
- Keep nav IDs and empty-state IDs stable (`#connect-wallet-btn`, `#theme-toggle-btn`, `#library-empty-state`, `#side-nav-library`) — they are reserved anchors for the rebuilt onboarding flow (the old `OnboardingTour`/`react-joyride` implementation was removed).

**DON'T:**
- Don't hardcode raw hex colors in component classes — every brand color is a token (`cyber-pink`, `lavender`, `midnight`, `background`, `card`, palette `emerald-500`, etc.) and the app was swept clean of arbitrary hex classes. Legitimate exceptions: third-party brand marks (Google/Discord) and non-class contexts (QR code and recharts props, PWA `themeColor`). For color inside arbitrary values (e.g. hard shadows), use `theme(colors.lavender)` syntax.
- Don't reintroduce the retired angular system: no `clip-angular-*`/`clip-hexagon`/`clip-diamond`/`clip-tag` (the utilities were deleted from `globals.css`), no `rounded-none` overrides, no zeroing of `--radius`.
- Don't introduce new component libraries, toast systems, or icon sets — Tabler Icons + Radix/shadcn + sonner are the stack; lucide-react and framer-motion stay out of `frontend/home`.
- Don't build custom focus/keyboard handling for dialogs or menus — Radix already traps focus and handles Escape/arrows; overriding it must be a conscious, commented exception.
- Don't add z-index layers above `z-[60]`, new breakpoint prefixes beyond `sm/md/lg`, or global `!important` rules outside the existing dark-contrast and `:lang()` font overrides.

---

*Grounded in: `frontend/{app,home}/tailwind.config.ts`, `frontend/app/app/globals.css`, `frontend/home/src/index.css`, `frontend/{app,home}/components/ui/*`, `DashboardLayoutClient.tsx`, `ConnectHeader.tsx`, `AuthModal.tsx`, `SongCard.tsx`, `Navbar.tsx`, `ThemeToggle.tsx` (both), and package manifests. Last synchronized with the rounded-glass unification (app migrated to home's `--radius: 0.75rem` / `.glass-surface` system). Where the code disagrees with this document, the code was right at time of writing — open an issue before drifting.*
