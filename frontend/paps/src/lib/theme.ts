/**
 * Surface values for the two places that cannot take a Tailwind class.
 *
 * lightweight-charts paints into a <canvas>, so its axis text, grid and scale
 * borders are a JS theme object — there is no element to hang `text-muted` or
 * `border-line` on. The SwipeDeck sparkline has the same problem one layer down:
 * its gradient stops are SVG paint attributes.
 *
 * Everything here mirrors a token in src/index.css. There is no build step that
 * can catch the two drifting apart, so if a surface token moves, move its twin
 * here in the same commit.
 */

/** Axis labels. Mirrors --muted hsl(240 5% 62%) — the same grey as a text-muted fact. */
export const CHART_TEXT = '#9999a3';

/** Price-scale and time-scale rules. Mirrors --line hsl(240 10% 22%). */
export const CHART_LINE = '#32323e';

/** Grid lines. Stays an alpha so it stacks on whatever fill is under it. */
export const CHART_GRID = 'rgba(255,255,255,0.04)';

/**
 * Chart micro-labels are prices and times, so they are numerals, so they are
 * mono — the same rule that puts .num on every figure in the blotter.
 */
export const CHART_FONT = "'IBM Plex Mono', ui-monospace, monospace";
