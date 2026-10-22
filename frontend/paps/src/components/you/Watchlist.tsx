/**
 * Market preferences, not a settings list: the starred symbols the deck already leads
 * with. Removing one is the same call that added it, so there is nothing to explain.
 */
export function Watchlist({
  symbols,
  onToggle,
}: {
  symbols: string[];
  onToggle: (symbol: string) => void;
}) {
  if (!symbols.length) {
    return (
      <div className="px-1">
        <p className="text-small text-muted">watching</p>
        <p className="mt-1 text-body text-muted">
          Nothing starred. Star a market in the market sheet and it leads the deck.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <span className="text-small text-muted">watching</span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {symbols.map((s) => (
          <button
            key={s}
            onClick={() => onToggle(s)}
            title={`remove ${s} from the starred markets`}
            className="inline-flex items-center gap-1.5 rounded-chip bg-panel-2 px-2 py-1 text-small text-fg"
          >
            <span className="num">{s}</span>
            <span aria-hidden className="text-muted">
              ×
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-small text-muted">
        Starring happens in the market sheet; starred markets lead the deck.
      </p>
    </div>
  );
}
