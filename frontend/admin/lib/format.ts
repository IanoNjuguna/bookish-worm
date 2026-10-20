export function ada(lovelaceOrAda: number): string {
  return lovelaceOrAda.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function count(n: number): string {
  return n.toLocaleString('en-US');
}

export function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function signed(value: number, unit = ''): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${ada(Math.abs(value))}${unit}`;
}

/** A share of a total, guarded against an empty population. */
export function share(part: number, total: number): number {
  return total === 0 ? 0 : part / total;
}
