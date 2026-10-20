import { cn } from '@/lib/utils';

/**
 * The admin data surface. Solid, not glass: these screens sit on a flat background
 * with no ambient layer, so a border-plus-blur reads as noise instead of elevation.
 * Elevation is inverse by theme, because a soft shadow is invisible on midnight.
 */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-midnight/[0.06] bg-card p-5',
        'shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:shadow-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-lavender">
      {children}
    </p>
  );
}

export function Figure({ children, quiet }: { children: React.ReactNode; quiet?: boolean }) {
  return (
    <p
      className={cn(
        'font-mono tabular-nums leading-none',
        quiet ? 'text-2xl text-midnight/50 dark:text-white/50' : 'text-4xl text-midnight dark:text-white',
      )}
    >
      {children}
    </p>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-midnight/55 dark:text-white/50">{children}</p>;
}
