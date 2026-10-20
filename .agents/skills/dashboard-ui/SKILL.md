---
name: dashboard-ui
description: Use when building a dashboard, overview or operator screen. Composition rules for doba surfaces whose job is summarising data and routing someone to detail, including Z layout, whole-card drill-down, data-to-ink and anchoring.
type: prompt
whenToUse: When designing or building any dashboard, overview, admin or operator screen, or any surface whose job is summarising data and routing someone to detail
---

# Dashboard UI

A dashboard is for scanning and deciding, not reading. If a screen needs a paragraph to be understood,
the content is in the wrong place.

Boundaries: `design-enforcement` owns the look (`DESIGN.md`) and this skill never restates a token as
an exception to it. `modular-ui-authoring` owns file structure. `apple-design` owns motion.
`break-ui` owns worst-case data. `feature-process` owns the issue, branch and PR path. This skill
owns **composition**: what goes where, how much of it, and what happens when someone clicks.

## 1. Wireframe before components

Draw the layout in ASCII in the plan, with real content from the real data, before writing a single
component. Place blocks by importance, not by what is easy to query.

```
┌──────────────────────────────────────────────────────────────┐
│ TOP BAR   product · environment · identity · global action   │
├──────────────────────────────────────────────────────────────┤
│ SUMMARY   one line: what needs attention, and when it was read│
├───────────────────────────┬──────────────────────────────────┤
│ PRIMARY CARD  (needs you) │ PRIMARY CARD  (the number)       │
├───────────────────────────┴──────────────────────────────────┤
│ SECTION TITLE + switch                                        │
│ ┌────────┬────────┬────────┬────────┐                         │
│ │ row    │ row    │ row    │ row    │  drill on click         │
│ └────────┴────────┴────────┴────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

If the wireframe needs an explanation, the layout is wrong, not the explanation.

## 2. Grid and hierarchy (Z pattern)

- One page-level grid, 12 columns at `lg`, collapsing to a single column below it. Cards span in
  multiples of 3 or 4, never arbitrary fractions.
- **The composition is a Z, not an F.** Two horizontal sweeps joined by one diagonal: the eye enters
  top-left, crosses to the right, drops diagonally to the left, then sweeps right again. Everything
  above that second sweep is the decision; everything below it is evidence.
- **Band 1 is a causal pair, read left to right.** The input on the left, the outcome on the right, and
  the ratio between them rendered as the connective tissue rather than as a third card. If the two
  numbers have no causal relationship, the layout is wrong.
- **The diagonal carries exactly one element.** A diagonal cannot be compared across, so nothing that
  needs side-by-side reading goes there. It holds the qualifying element: health, trust, or the single
  transition that explains how the left of band 1 became the right of band 1.
- **Band 2 is the explanation**: the levers on the left, the population that drives them on the right.
- **Priority still wins over geometry.** The most decision-changing item is in band 1. If it cannot be
  first, it must be the most visually dominant element in the band, and that has to be deliberate.
- Below the second sweep the Z stops: lists and charts read top-down like anything else. A Z that is
  enforced all the way down a page of tables is an affectation.
- Three tiers at most: summary, decision bands, evidence. A fourth tier means a page, not a dashboard.
- Section titles are mandatory and use the repo's label scale: `text-xs font-bold uppercase
  tracking-[0.15em] text-lavender`, with the section body below it. A dashboard with unlabelled bands
  reads as one long scroll.

## 3. One concept per card

- A card answers one question. If two questions need answering, that is two cards.
- Card anatomy, in order: label, figure, unit or state, single affordance. Label at the label scale,
  figure at `font-mono tabular-nums` in a display-adjacent size, nothing else.
- Numbers are mono, tabular, right-aligned when they sit in a column of numbers. Never proportional
  figures next to each other, because they jitter on update.
- No card that only repeats a number already shown in the summary line.
- No nested cards. Elevation is one level deep or it stops meaning anything.

### Anchoring: a number alone means nothing

A metric with no context is a decoration. Every figure carries at least one of:

- **change against a named previous period**: "1,284 collected, +37 on the previous 7 days". The period
  is part of the label, never implied.
- **a baseline or target**: a threshold line, a cap, a budget.
- **a sparkline** showing the shape that produced the number.
- **a ratio with its denominator visible**: "3 of 7 releases", not "3".

Rules that follow from it:

- Direction is only coloured when direction is meaningful. A count going up is not automatically good.
- Signed deltas, always, with the sign visible. `+12` and `-12` must not look alike.
- If there is no baseline yet, say so: "first read, no change to show" beats a fabricated `0%`.
- Never average two periods together to hide a gap; show the gap.

## 4. Text discipline

- Card text is a label and a state. Two lines maximum, one sentence each.
- Never a paragraph on a dashboard. If it is needed, it belongs on the drill-down page behind the card.
- Truncate with a `title` attribute and expose the full value in the detail view. Never truncate money,
  counts, dates or anything a person compares.
- Empty is explicit: say "no data" with a reason. Unknown, stale and zero are three different states and
  must look different.

## 5. Clicking

- **If the only action on a card is "see more", make the whole card clickable.** One focusable element,
  the card itself, `focus-visible:ring-2`, cursor pointer, hover elevation. No "View" link in the corner
  competing with the card.
- A card with a side-effecting action gets a real button, and then the card surface is not a link. Never
  mix a whole-card link with an inner button: nested interactive elements are invalid HTML and break
  keyboard and screen reader use.
- The click target must be predictable: the card goes somewhere, a button does something.
- Detail lives on its own route when it should be shareable, so someone can paste a link to a specific
  row. A sheet is for quick peeks, not for the only way to see detail.

## 6. Charts

### Data to ink

Ink that is not carrying data is a bug. Before shipping a chart, remove every mark that survives the
question "what does this pixel tell me?":

- No chart border, no plot-area fill, no card shadow inside the plot.
- Gridlines only when reading a value against an axis is the job: two or three faint horizontal rules,
  never a full lattice. If every point is labelled directly, the axis and the grid can both go.
- One line weight for series, about 1.5 to 2px, and a thinner rule for reference lines.
- Direct labels at the end of a series instead of a legend, whenever there are three series or fewer.
- No gradients under area charts unless the fill encodes a threshold. No 3D, no bevels, no drop
  shadows on marks, no decorative markers.
- Axes lose their lines before they lose their labels. Truncating a scale to make a line exciting is a
  lie, not a style.
- In a card, a sparkline beats a full chart: same information, a tenth of the ink.

### Controls and honesty

- Never a chart without a view switcher and a date range control. The first question any operator asks
  is "over what period, and by what", and both must be answerable without leaving the screen.
- The switcher is a segmented control or the `ui/select` primitive, consistent across every chart.
- Axis labels and units always. A chart that needs a legend lookup to read a single value is a table
  pretending to be a chart.
- Series colours come from the palette in a fixed order, not per-chart invention. Status colours keep
  their meanings (section 7).
- Empty, single-point and stale series each need a state. A flat line and an empty dataset must not look
  the same.
- Respect `prefers-reduced-motion`; no animated chart entry on a data screen.

## 7. Visual anchors and status conventions

**Status mapping uses the four meanings the palette already has. Do not add a token for a fifth state.**

| State | Colour | Treatment |
| --- | --- | --- |
| pass | `emerald-500` | solid chip |
| failing | destructive red | solid fill chip |
| stale | `red-400` | outline chip, same icon family as failing |
| acknowledged | `text-lavender` | outline chip |
| unknown | muted grey | no chip fill, label only |

- Stale is a caution, not neutral information: data that may be hours old can be wrong, so lavender
  understates it. It is also not a failure, so it must not take destructive red. `red-400` is already
  this system's warning tone, and solid versus outline separates the two severities.
- Unknown is absence, not a state to colour. Muted label, no chip.
- A new state borrows from an existing meaning and documents the borrowing. Adding amber for one screen
  is system drift: every later surface then has to choose between `red-400`, amber and destructive red,
  and nobody will.
- Status is never colour alone: icon plus label plus colour, so it survives colour blindness and a
  greyscale screenshot.
- Order is an anchor. Failing first, then stale or acknowledged, then passing, and within a group a
  stable secondary sort. Never reorder by whatever the query returned.
- Naming consistency is an anchor too: one word per concept across the whole surface, verb-first for
  actions, noun-first for states, and the same word in the UI as in the API and the audit log.
- Every figure that came from somewhere says where: a read time, a provider, or the word "cached". A
  number with no provenance is a number nobody can trust.

## 8. Surfaces, shadows and density

Dashboard data surfaces use the solid `card` token, not `.glass-surface`. Glass borders carry elevation
in the consumer app because those surfaces float over an ambient animated background; a dashboard is a
flat data screen, where blur behind dense rows costs legibility and paint time and signals nothing.

Elevation is inverse by theme, because shadows are invisible on dark:

- **light:** solid `card`, neutral `shadow-sm`, hairline `border-midnight/[0.06]`
- **dark:** same card, **no shadow**, elevation from surface lightness plus `border-white/[0.06]`
- **interactive cards only:** a slightly stronger neutral shadow, still no glow
- **never** `shadow-pink-glow` or `shadow-card-glow` in admin. Glow is a consumer affordance signal and
  would compete with the status colours
- overlays keep the existing dialog and sheet treatment; this rule is about data surfaces only

Keep it scoped: implement as a utility or component inside the admin app, never in `components/ui`, so
the consumer app cannot inherit it by accident. Card padding `p-5 sm:p-6`, gaps on the 4px scale, shell
in `max-w-7xl mx-auto`. Dense is not cramped: comfortable row height, exact alignment, hairlines between
rows rather than boxes around them.

## 9. Loading, empty and failure

- Loading is `Skeleton` shapes matching the final layout, never a spinner for content, never a centred
  "Loading…" replacing the page.
- Every panel has an empty state and a failure state, distinguishable at a glance, each with the next
  action if there is one.
- Async feedback uses `sonner` toasts, per `DESIGN.md`. No inline status text that vanishes.

## 10. Anti-patterns

- Three equal stat cards in a row with centred numbers. That is the AI shape of a dashboard, and it
  wastes band 1, which belongs to the causal pair.
- A hero heading and a paragraph above the data.
- A card with four CTAs, or a card whose only content is another card's title.
- Rainbow chips: five colours for five states that nobody can read without a legend.
- Charts that change colour or scale depending on which chart you are looking at.
- A dashboard whose numbers are cached and do not say so.
- Nested cards, cards inside scroll areas inside cards.

## 11. Checklist

- [ ] ASCII wireframe exists, built from real data, and reads without explanation.
- [ ] Layout is a Z: two sweeps, one diagonal, and the diagonal carries a single qualifying element.
- [ ] Band 1 is a causal pair, with the ratio between them drawn as connective tissue.
- [ ] The most decision-changing block is in band 1, and nobody had to explain the order.
- [ ] The single most important block is first, and ordering was chosen by decision impact, not by query ease.
- [ ] The order is legible without a caption; the reader's first two fixations are the decision.
- [ ] Every band has a section label.
- [ ] One concept per card; no card repeats the summary.
- [ ] Every figure is anchored: named prior period, baseline, sparkline, or a visible denominator.
- [ ] Deltas carry a sign, and colour is used only where direction is meaningful.
- [ ] Chart ink audited: no border or fill, at most a few faint gridlines, direct labels over legends.
- [ ] No truncated axis to flatter a series.
- [ ] Cards with only a drill-down are wholly clickable, one focusable element, focus ring visible.
- [ ] Cards with actions have buttons, and are not also links.
- [ ] Numbers are mono and tabular; money and counts are never truncated.
- [ ] Charts carry a view switcher, a date range, axis labels and units.
- [ ] Status uses the four existing meanings, icon and label as well as colour, with a stable sort order.
- [ ] No new colour token was introduced for a state; the borrowing is documented where it happens.
- [ ] Data surfaces are solid, elevation is shadow in light and surface lightness in dark, no glow.
- [ ] Every figure shows provenance or is marked cached.
- [ ] Loading, empty, stale and failure states each exist and look different.
- [ ] A support person can paste the URL of the thing they are looking at.

## 12. Worked example: the doba Overview

The reference composition, applied to this repo's own metrics. Full spec in
`doba-dashboard-spec.md`; this is the shape, not the numbers.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ product · environment · range · freshness · PROD badge                        │
├──────────────────────────┬─────────┬─────────────────────────────────────────┤
│ FAN SPEND / FAN          │  fee    │ OUR TAKE / FAN                          │
│ 20.10 ADA   +12% 30d     │ ──────▶ │ 2.01 ADA   +0.20 30d                    │
│ over 7 fans, median 1.90 │ realised│ median 0.19 · top fan 43% · n=7         │
├──────────────────────────┴─────────┴─────────────────────────────────────────┤
│ HEALTH  failed collects · chain fallbacks · API 5xx · supply drift           │
├──────────────────────────────────┬───────────────────────────────────────────┤
│ COLLECTS / FAN · AVG PRICE       │ CONVERSION  listeners ▶ collectors        │
├──────────────────────────────────┴───────────────────────────────────────────┤
│ FANS BY VALUE                    │ RELEASES BY TAKE / FAN                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ TAKE AND SPEND, 12 WEEKS                                    [ week │ month ] │
└──────────────────────────────────────────────────────────────────────────────┘
```

Why this satisfies the rules above: the ratio between the two band-1 numbers is the
arrow, not a card; health is the single diagonal element; the levers and the
population that drives them form the second sweep; the lists and the chart are
evidence and are exempt from the Z.

**Exemption: ledger pages.** A reconciliation or operations screen whose job is
comparing rows is not a dashboard composition. It uses the standard table pattern
(section labels, mono figures, status chips, whole-row click) and does not bend
itself into a Z. Say so explicitly when you write it, so the exemption is a rule
someone can read rather than a precedent someone has to infer.

## 13. Awaiting expansion

Deliberately left open for the repo owner to extend: dashboard navigation patterns beyond a single
level, cross-dashboard comparison, export and download conventions, and any per-surface density rules.

Amendments owed, to be made in the PR that first builds a dashboard (admin PR4), not before:

- `DESIGN.md` gains a short "Dashboards and data surfaces" subsection carrying the status mapping from
  section 7 and the light/dark elevation split from section 8, so the deviation is documented at the
  source rather than living only in this skill.
- That PR also adds the shared card utility inside the admin app, not in `components/ui`.
