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
