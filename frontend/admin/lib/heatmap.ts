export type DayCount = { day: string; collects: number; plays: number };

const DAY_MS = 86_400_000;

/** Monday-based week index, 0 = Monday, so the grid rows read Mon..Sun. */
function weekdayIndex(iso: string): number {
  const utc = Date.parse(`${iso}T00:00:00Z`);
  return (new Date(utc).getUTCDay() + 6) % 7;
}

/**
 * Buckets days into whole weeks ending today, oldest week first. Every cell is a
 * real date, including the days after today in the current week, which render
 * blank rather than carrying a zero.
 */
export function toWeeks(days: DayCount[], weeks = 12): (DayCount | null)[][] {
  if (days.length === 0) return [];

  const byDay = new Map(days.map((d) => [d.day, d]));
  const last = days[days.length - 1].day;
  const lastUtc = Date.parse(`${last}T00:00:00Z`);

  // walk back to the Monday of the week that is `weeks` weeks before the last week
  const endOfWeek = lastUtc + (6 - weekdayIndex(last)) * DAY_MS;
  const start = endOfWeek - (weeks * 7 - 1) * DAY_MS;

  const grid: (DayCount | null)[][] = [];
  for (let w = 0; w < weeks; w++) {
    const column: (DayCount | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const iso = new Date(start + (w * 7 + d) * DAY_MS).toISOString().slice(0, 10);
      column.push(iso > last ? null : (byDay.get(iso) ?? { day: iso, collects: 0, plays: 0 }));
    }
    grid.push(column);
  }
  return grid;
}

/**
 * Four steps, not a continuous ramp: a cell that says "some" and a cell that says
 * "many" are the only distinctions the eye makes reliably at 12px.
 */
export function intensity(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = value / max;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type HeatmapSummary = {
  total: number;
  activeDays: number;
  /** The weekday most collects landed on, or null before the first collect. */
  busiestWeekday: string | null;
};

export function summarizeHeatmap(days: DayCount[]): HeatmapSummary {
  const byWeekday = new Array(7).fill(0);
  let total = 0;
  let activeDays = 0;

  for (const day of days) {
    total += day.collects;
    if (day.collects > 0) {
      activeDays += 1;
      byWeekday[weekdayIndex(day.day)] += day.collects;
    }
  }

  const peak = Math.max(...byWeekday);
  return {
    total,
    activeDays,
    busiestWeekday: peak > 0 ? WEEKDAY_NAMES[byWeekday.indexOf(peak)] : null,
  };
}
