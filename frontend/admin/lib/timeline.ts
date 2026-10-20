import { apiBase } from './api';
import type { DayCount } from './heatmap';

export type Timeline = {
  days: DayCount[];
  /** false when core-api has no /admin/timeline yet, so the UI can say so honestly. */
  available: boolean;
};

export async function getTimeline(span = 84): Promise<Timeline> {
  try {
    const res = await fetch(`${apiBase}/admin/timeline?days=${span}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { days: [], available: false };
    const body = (await res.json()) as { timeline?: DayCount[] };
    return { days: body.timeline ?? [], available: Array.isArray(body.timeline) };
  } catch {
    return { days: [], available: false };
  }
}
