---
name: paps-design
description: Use when building paps or any trading terminal UI.
---

# paps design standard

The surface is a trading terminal. It is judged in the first two seconds by someone
who trades, and in the first twenty by someone who does not. Everything here exists
to pass both, and to look like a product rather than a generated dashboard.

## The tell we are avoiding

Generic dashboards share a silhouette: rounded cards, even gaps, one grey, one accent,
numbers in the same face as prose, and every panel the same visual weight. A trader
reads that as a mockup. The fixes below are cheap and do more than any illustration.

## Vibe: quiet money

paps is a phone app for people who find perps intimidating, so it borrows from
portfolio-first consumer apps (Public, Robinhood, Stake) rather than from exchange
terminals (OKX, Binance Pro). The feel is **quiet money**: the confidence of a bank app,
the clarity of a weather app, and no casino.

    space       20-24px gutters, sections separated by air rather than hairlines
    type        large friendly numerals (32-40px hero price), humanist sans, almost no
                uppercase micro-labels — those are terminal voice
    shape       rounded 16-20px cards and floating pills; corner radius is the strongest
                consumer-app signal and a terminal gives it up for free
    motion      sheets spring and settle, cards fly with follow-through; nothing linear
    words       "you'd lose $98 if ADA hits 0.183" beats "liq. 0.1830 (−19.6%)" for a
                first-time perp trader

Ban list, because gamification is the trap: confetti, sounds, streaks tied to wins,
count-up animations on money, red flashing when down. The deck's playfulness comes from
the gesture, not the paint.

This does not cancel the terminal rules below where they still apply — mono numerals for
columns, green/red only for direction, no invented numbers — it changes the shell around
them: four tabs at the bottom, a header with four facts, tickets in sheets.

## Layout

- **Square corners.** Panels are rectangles separated by 1px hairlines. Radius is a
  consumer-surface habit; it wastes the corner where a number could sit.
- **Four rails, one screen, no navigation.** Markets | chart + blotter | book | ticket.
  Nothing navigates away to trade.
- **The header is a status bar, not a hero.** 48px, six numbers, one environment
  badge. If it grows past 56px it has started advertising.
- **The blotter is the product.** Positions, open orders, fills, balances. A trader
  spends more time there than in the ticket.
- **Density**: rows 19–22px, body 11–12px, labels 10px uppercase at 0.08em. Anything
  larger than 14px on this surface is a headline and needs to earn it.

## Numbers

- **All numerals in a mono face** (IBM Plex Mono), all labels in the sans (Inter).
  This single rule is what separates a terminal from a dashboard template.
- `tabular-nums` everywhere so columns do not jitter as values tick.
- Fixed decimals per instrument, taken from `pricePrecision`; never format a price by
  eyeballing its magnitude.
- Align numbers right, labels left, one row per fact. Never centre a number.
- A number without a denominator or a direction is not information. Pair it: `19.9%
  APR`, `+0.15%`, `2 of 7 releases`.

## Colour

    canvas      #0b0b0b        panels #121212 / #171717
    hairline    #1f1f1f        body text #e8e8e8, muted #8c8c8c
    long        #00b47a        short #f0534e
    brand       doba pink, used only for the environment badge and the active market

- Green and red mean direction and PnL. Nothing decorative is ever green or red.
- No amber. Warning states borrow red; absence is muted text.
- Depth bars sit at 12–14% opacity; the number always outranks its bar.

## States, and telling the truth about them

- **Connected is not fresh.** A websocket can stay open while prices stop moving. Show
  data age (`updated 1.2s ago`) and turn it red past the threshold, not a green dot
  that means "socket open".
- **Paper is on the action, not in a footer.** Environment goes inside the CTA
  ("Open long · paper") and in the header badge. A footer disclaimer is not a label.
- **Empty states say what would fill them**: "No positions. Open a paper position to
  see it marked live."
- **Never invent a number.** If a value is unknown, render an em dash and say why.

## Pro / Lite, one engine

Same state, two presentations. The toggle is a view control, never a mode with
separate data.

- **Pro**: four rails, full ticket, book, blotter with four tabs.
- **Lite**: one column. Price, a small chart, direction as two large equal buttons,
  amount with percentage chips, leverage as five presets, then risk in one line
  (margin, liquidation, fee). Everything else is a link, not a panel.
- **Mobile is Lite with a different arrangement**, not a squeeze of Pro. Ticket
  becomes a bottom sheet; the book and rail collapse behind tabs.

## Swipe deck

Sampled from Tinder (deck mechanics), Plenty of Fish (action row inside the card) and
Bumble (depth behind an info affordance). Every engaging swipe card is one hero, three
or four facts, and large decisive actions.

- **One hero per card.** For a market that is the 1m sparkline, drawn inline, with the
  symbol and price sitting over a gradient at its foot. A card with no hero is a form.
- **Three chips on the face.** If a fact does not change the decision, it goes in the
  details drawer, not on the card.
- **Actions are circles, 48px, under the deck**: undo, pass, short, long. A button bar
  reads like a form; circles read like a decision.
- **Depth must be felt**: ticks for the batch, stacked shadows behind the top card.
  Never show a count of the whole universe — markets are infinite, attention is not.
- **A swipe is immediate, with two seconds of undo.** The undo is the safety, not the
  confirm: confirming kills the gesture, and no undo makes it dangerous.
- **Close the loop**: a cap on open positions, stated on screen, because after ten
  swipes the bottleneck is capital rather than choice.

## Interaction

- One click from a book row loads a price into the ticket. Two clicks never needed.
- Sliders carry percentage chips (0/25/50/75/100); a bare slider forces arithmetic.
- The primary action is the widest thing on screen and says what it does (`Open long
  ADA`), never "Submit".
- Focus is visible, hover is subtle, and nothing animates longer than 150ms except
  the chart.

## Sources

Patterns come from OKX (dual ticket, demo label inside the button, percentage chips),
Binance (bottom status strip, market marquee, fee line under the CTA) and Gemini
(single-column lite trade), all sampled in Mobbin. Their layouts are reference; their
marks, fonts and copy are not.

## Layout traps that look like design bugs

Four failures that read as bad taste and are actually CSS, all found by rendering at
390px rather than by reading the code:

- **A chart or canvas 2px tall.** A percentage height (`h-full`) inside a `min-h-*` parent
  resolves against `auto`, so it collapses. The wrapper must be a flex column and the
  child `flex-1`, never `h-full` under a min-height.
- **A header symbol truncated to one letter.** Flex children shrink in proportion to
  content until only `truncate` is left. Give the identity chip `hidden sm:inline` for its
  label — an icon keeps its meaning, a symbol does not — before touching the type size.
- **A table that is "fine" at 1200px.** Eleven columns at 390px clips mid-word with no
  affordance saying more exists. Below `sm`, one entity is one card: identity and PnL on
  the first line, three facts on the second, actions on the third.
- **`\u00a0` printed as text.** A JSX text node does not interpret escapes; use
  `{'/\u00a0'}` or `&nbsp;`. This shows up first in a unit label like `/ 8h`.

And one build trap: the dev server and the Tailwind CLI can load different configs, so
`tailwindcss -i src/index.css` compiles while Vite answers 500 with "the `bg-canvas`
class does not exist". Name the config explicitly in `postcss.config.js`.
