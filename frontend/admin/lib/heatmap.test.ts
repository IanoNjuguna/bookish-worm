/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { intensity, toWeeks, type DayCount } from './heatmap';

const day = (iso: string, collects = 0, plays = 0): DayCount => ({ day: iso, collects, plays });

function range(endIso: string, days: number): DayCount[] {
  const end = Date.parse(`${endIso}T00:00:00Z`);
  return Array.from({ length: days }, (_, i) =>
    day(new Date(end - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10)),
  ).map((d) => d);
}

describe('toWeeks', () => {
  test('produces 12 columns of 7 rows', () => {
    const weeks = toWeeks(range('2026-10-19', 84));
    expect(weeks.length).toBe(12);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  test('rows run Monday to Sunday, and future days stay blank', () => {
    // 2026-10-19 is a Monday and the last real day, so the week is half-blank
    const weeks = toWeeks(range('2026-10-19', 84));
    expect(weeks.at(-1)![0]?.day).toBe('2026-10-19');
    expect(weeks.at(-1)![6]).toBeNull();
  });

  test('days after the last real day are blank, not zero', () => {
    const weeks = toWeeks(range('2026-10-21', 84)); // Wednesday
    const lastWeek = weeks.at(-1)!;
    expect(lastWeek[2]?.day).toBe('2026-10-21');
    expect(lastWeek[3]).toBeNull();
  });

  test('carries the counts through to the right cell', () => {
    const days = range('2026-10-19', 84).map((d) =>
      d.day === '2026-10-19' ? { ...d, collects: 3 } : d,
    );
    const weeks = toWeeks(days);
    expect(weeks.at(-1)![0]!.collects).toBe(3);
  });

  test('empty input means no grid', () => {
    expect(toWeeks([])).toEqual([]);
  });
});

describe('intensity', () => {
  test('zero is empty and one is full', () => {
    expect(intensity(0, 5)).toBe(0);
    expect(intensity(5, 5)).toBe(4);
  });

  test('a single collect on a sparse week reaches the top step', () => {
    expect(intensity(1, 1)).toBe(4);
  });

  test('steps are ordered and bounded', () => {
    const levels = [1, 2, 3, 4].map((v) => intensity(v, 4));
    expect(levels).toEqual([2, 3, 4, 4]);
  });
});
