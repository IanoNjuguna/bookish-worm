# TASK: Repository Analysis & Systemic DESIGN.md Generation

You are a dual-persona AI acting as a **Lead Design System Engineer** and a **Principal UI/UX Architect**.

Your goal is to deeply analyze this repository's user interface, component patterns, styling setup, design tokens, and user flows, then author a comprehensive, standardizing `DESIGN.md` specification file.

This document will serve as the single source of truth for all future UI/UX development, design token usage, component contracts, and UI styling consistency across human developers and AI agents working on this project.

---

### STAGE 1: CODEBASE UI REPOSITORY SCAN
Scan the repository thoroughly (CSS/Tailwind configurations, global styles, theme providers, UI component libraries, icons, layout wrappers, and typography setup). The repo may contain MULTIPLE frontend surfaces (e.g. `frontend/app` dashboard and `frontend/home` marketing site) — audit all of them and document whether they share one design system or diverge. Identify:

1. **Design Tokens & Theme System:** Color palette (primary, semantic, neutral, background, borders), typography scales, spacing scale, radius values, shadows, and z-index layers.
2. **Layout & Grid Philosophy:** Screen breakpoints, page container max-widths, flex/grid conventions, sidebar/header patterns, and vertical rhythm.
3. **Component Inventory & Patterns:** Common primitives (Buttons, Inputs, Cards, Modals, Badges, Tables, Toast notifications, Tooltips) and their visual states (hover, active, focus, disabled, loading).
4. **Interactive & Motion Tokens:** Transition durations, easing curves, animation keyframes, and micro-interactions.
5. **Accessibility & Dark Mode:** ARIA conventions, contrast levels, focus ring standards, keyboard navigation, and theme toggling implementation.

---

### STAGE 2: OUTPUT DELIVERABLE (`DESIGN.md`)
Generate the exact Markdown file `DESIGN.md` using the following standardized structure:

# DESIGN.md — Systemic UI/UX & Component Architecture

> **Core Visual Ethos:** [1-2 sentences summarizing the visual personality of the app—e.g., "Dense, high-information-density developer tool with dark-mode first aesthetic and sharp borders."]

[If multiple frontend surfaces exist: a table naming each surface, its path, stack, and role — and an explicit statement of whether the design system is unified or per-surface.]

---

## 1. Visual Foundation & Design Tokens

### Color System
Provide functional color variables and class usage:
- **Brand / Primary:** [Values & purpose]
- **Surface / Backgrounds:** [Elevation layers, card backgrounds, overlay fills, glass/translucency tokens]
- **Text & Hierarchy:** [Primary, muted, disabled, subtle]
- **Semantic / Status:** [Success, Warning, Error, Info]

### Typography
- **Font Families:** [Sans, Serif, Mono fonts used, incl. non-Latin script fallbacks]
- **Type Scale:** [Header levels h1–h6, body text, caption, code snippets with sizes and line-heights]

### Spacing, Radius & Elevation
- **Spacing Scale:** [Standard grid/spacing multipliers used in code]
- **Border Radius:** [Card, Button, Modal, Badge border radii — name the canonical scale and any deprecated/retired shape systems]
- **Shadows / Elevation:** [Flat, low, medium, floating overlays]

---

## 2. Layout & Responsive Architecture
- **Breakpoints:** [Mobile, Tablet, Desktop, Wide values]
- **Page Layout Patterns:** [Standard page shell, dashboard container, sidebar behavior, navigation]
- **Grid & Alignment Standards:** [Form alignment, card grids, table padding standards]

---

## 3. Core Component Library Standards
Detail the strict implementation guidelines for core UI primitives:

- **Buttons & Action Triggers:** Sizes, variants (Primary, Secondary, Ghost, Destructive), loading/disabled states.
- **Form Controls & Inputs:** Field borders, focus state rings, error state messages, label placements.
- **Cards & Content Containers:** Header, Body, Footer structures, padding conventions, hover effects.
- **Feedback & Overlays:** Modals, Drawers, Toasts, Tooltips, Empty states, Skeleton loaders.

---

## 4. State Management & Micro-Interactions
- **Focus & Keyboard Navigation:** Global focus ring style, tab orders, theme toggling mechanism.
- **Motion & Transitions:** Transition timings (e.g., 150ms ease-in-out), enter/exit animations.
- **Empty & Error States:** Standard visual layout for empty views and network error boundaries.

---

## 5. Development Enforcement Rules (Do's and Don'ts)
- **DO:** [5 strict bullet points on standard code styling practice in this app]
- **DON'T:** [5 strict anti-patterns to avoid, e.g., "Do not hardcode arbitrary hex colors; use Tailwind theme tokens." Name any retired/deprecated patterns explicitly so agents do not resurrect them.]

---

### CONSTRAINTS:
- Use exact tokens, CSS variables, utility classes (e.g., Tailwind classes), or styled-system rules currently in the repository.
- Do NOT invent arbitrary design specs that conflict with existing code unless explicitly flagging it as a recommended standardization fix.
- When design debt is found (hardcoded hexes, dead utility classes, divergent per-surface systems), document the target standard and flag the debt — do not silently normalize.
- Save the result to `DESIGN.md` in the root of the repository.
