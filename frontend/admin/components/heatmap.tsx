import { intensity, toWeeks, type DayCount } from '@/lib/heatmap';

const STEP = [
  'bg-transparent ring-1 ring-inset ring-midnight/[0.08] dark:ring-white/[0.12]',
  'bg-chart-1/25',
  'bg-chart-1/45',
  'bg-chart-1/70',
  'bg-chart-1',
];

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Collects per day, twelve weeks. One hue at four opacities; empty days are a
 * hairline rather than a fill, so absence reads as absence.
 */
export function Heatmap({ days, label }: { days: DayCount[]; label: string }) {
  const weeks = toWeeks(days);
  const max = Math.max(1, ...days.map((d) => d.collects));

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-[3px] pt-[1px]">
        {WEEKDAYS.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="h-3 w-2 font-mono text-[9px] leading-3 text-midnight/35 dark:text-white/35"
          >
            {i % 2 === 0 ? d : ''}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => {
              if (!day) {
                return <span key={di} className="h-3 w-3 rounded-[3px]" />;
              }
              const level = intensity(day.collects, max);
              return (
                <span
                  key={di}
                  role="img"
                  aria-label={`${day.day}: ${day.collects} collects, ${day.plays} plays`}
                  title={`${day.day} · ${day.collects} collects · ${day.plays} plays`}
                  className={`h-3 w-3 rounded-[3px] ${STEP[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
