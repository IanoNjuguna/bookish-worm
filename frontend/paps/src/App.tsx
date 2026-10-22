import { useEffect, useMemo, useState } from 'react';
import { symbolInfo, useSymbols } from './hooks/useSymbols';
import { useTicker } from './hooks/useTicker';
import { useKlines } from './hooks/useKlines';
import { useMarkPrice } from './hooks/useMarket';
import { useMiniTickers } from './hooks/useMiniTickers';
import { useDeck, type DeckCard } from './hooks/useDeck';
import { useSparklines } from './hooks/useSparklines';
import { useIdentity } from './hooks/useIdentity';
import { TopBar, type ViewMode } from './components/TopBar';
import { Blotter } from './components/Blotter';
import { LiteView } from './components/LiteView';
import { SwipeDeck } from './components/SwipeDeck';
import { MarketSheet } from './components/MarketSheet';
import { socket } from './lib/ws';
import { START_EQUITY, usePaperAccount } from './lib/store';
import { liquidationPrice, type Side } from './lib/order';
import {
  drawdownPct,
  grade,
  nextTier,
  objectiveFor,
  objectiveMet,
  tierFor,
} from './lib/progress';
import type { Interval } from './lib/constants';

const FALLBACK_RISK = 100;
const FALLBACK_LEVERAGE = 5;
const DECK_SIZE = 10;
const UNDO_MS = 2_000;

export default function App() {
  const [symbol, setSymbol] = useState('ADA-USD');
  const [interval, setInterval] = useState<Interval>('15m');
  const [mode, setMode] = useState<ViewMode>('swipe');
  const [modeTouched, setModeTouched] = useState(false);
  const [connected, setConnected] = useState(false);
  const [swiped, setSwiped] = useState<string[]>([]);
  const [undo, setUndo] = useState<{ id: string; symbol: string; side: Side } | null>(null);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [round, setRound] = useState(0);
  const [roundStart, setRoundStart] = useState({ equity: START_EQUITY });
  const [roundBase, setRoundBase] = useState({ clean: 0, liq: 0 });

  // Pro is archived: this is a phone product, so the two views that fit a thumb are
  // the two views that ship. The components remain in the tree, unused.
  const modes: ViewMode[] = ['lite', 'swipe'];

  const { symbols } = useSymbols();
  const mini = useMiniTickers();
  const { ticker } = useTicker(symbol);
  const { mark, lastAt } = useMarkPrice(symbol);
  const { bars, error } = useKlines(symbol, interval);
  const account = usePaperAccount();
  const identity = useIdentity();
  const profile = identity.profile;
  const deck = useDeck(symbols, mini, DECK_SIZE, profile.watchlist, round);

  const view: ViewMode = modes.includes(mode) ? mode : 'swipe';
  const tier = tierFor(profile.stats);
  const swipeRisk = profile.riskUsd || FALLBACK_RISK;
  // Leverage is capped by tier: more rope only after evidence of discipline.
  const swipeLeverage = Math.min(profile.leverage || FALLBACK_LEVERAGE, tier.maxLeverage);

  useEffect(() => {
    socket.connect();
    socket.onState = (s) => setConnected(s === 'open');
    // The socket outlives this component: hooks own their subscriptions by reference
    // count, so tearing it down here would only cause a reconnect storm under
    // StrictMode's double mount.
  }, []);

  useEffect(() => {
    if (!modeTouched && modes.includes(profile.defaultView)) setMode(profile.defaultView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.defaultView, modeTouched]);

  useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), UNDO_MS);
    return () => window.clearTimeout(id);
  }, [undo]);

  const info = symbolInfo(symbols, symbol);
  const last = mini[symbol]?.last ?? Number(ticker?.lastPrice ?? 0);
  const markPrice = Number(mark?.markPrice ?? last);

  const marks = useMemo(() => {
    const out: Record<string, number> = {};
    for (const [sym, t] of Object.entries(mini)) out[sym] = t.last;
    if (mark && Number.isFinite(Number(mark.markPrice))) out[mark.symbol] = Number(mark.markPrice);
    return out;
  }, [mini, mark]);

  const stepFor = (s: string) =>
    Number(symbolInfo(symbols, s)?.filters?.find((f) => f.filterType === 'LOT_SIZE')?.stepSize ?? 1);

  const place = (o: { side: Side; kind: 'limit' | 'market'; price: number; size: number; leverage: number }) =>
    account.place({ ...o, symbol, mark: markPrice, step: stepFor(symbol) });

  // Liquidation is enforced by the venue: a position past its liquidation price is
  // closed at the mark and charged the fee, exactly like a real one would be.
  useEffect(() => {
    if (!account.positions.length) return;
    const doomed = account.positions.filter((p) => {
      const m = marks[p.symbol];
      if (!m) return false;
      const liq = liquidationPrice(p.side, p.entry, p.margin, p.size);
      if (!liq) return false;
      return p.side === 'LONG' ? m <= liq : m >= liq;
    });
    if (doomed.length) account.liquidate(doomed.map((p) => p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marks, account.positions]);

  const minLiqDistance = useMemo(() => {
    if (!account.positions.length) return 99;
    return Math.min(
      ...account.positions.map((p) => {
        const m = marks[p.symbol] ?? markPrice;
        const liq = liquidationPrice(p.side, p.entry, p.margin, p.size);
        if (!liq || !m) return 99;
        return (Math.abs(m - liq) / m) * 100;
      }),
    );
  }, [account.positions, marks, markPrice]);

  const remaining = useMemo(() => {
    const left = deck.cards.filter((c) => !swiped.includes(c.symbol));
    const watched = left.filter((c) => profile.watchlist.includes(c.symbol));
    return [...watched, ...left.filter((c) => !profile.watchlist.includes(c.symbol))];
  }, [deck.cards, swiped, profile.watchlist]);

  const spark = useSparklines(remaining.slice(0, 4).map((c) => c.symbol));

  const onSwipe = (card: DeckCard, side: Side) => {
    const id = `swipe-${card.symbol}-${Date.now()}`;
    account.place({
      id,
      symbol: card.symbol,
      side,
      kind: 'market',
      price: card.markPrice,
      size: Math.max(stepFor(card.symbol), swipeRisk / card.markPrice),
      leverage: swipeLeverage,
      mark: card.markPrice,
      step: stepFor(card.symbol),
    });
    setSwiped((prev) => [...prev, card.symbol]);
    setUndo({ id, symbol: card.symbol, side });
  };

  const objective = objectiveFor(round);
  const outcome = {
    swipes: swiped.length,
    closesInProfit: account.stats.cleanCloses - roundBase.clean,
    liquidations: account.stats.liquidations - roundBase.liq,
    openNow: account.positions.length,
    minLiqDistance,
  };

  const blotter = (
    <Blotter
      positions={account.positions}
      orders={account.orders}
      fills={account.fills}
      equity={account.equity}
      mark={markPrice}
      marks={marks}
      symbol={symbol}
      onClose={account.close}
      onCloseAll={account.closeAll}
      onCancel={account.cancel}
    />
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        symbol={view === 'swipe' ? (remaining[0]?.symbol ?? symbol) : symbol}
        ticker={mini[view === 'swipe' ? (remaining[0]?.symbol ?? symbol) : symbol]}
        mark={view === 'swipe' ? null : mark}
        lastAt={lastAt}
        equity={account.equity}
        connected={connected}
        mode={view}
        modes={modes}
        onMode={(m) => {
          setModeTouched(true);
          setMode(m);
        }}
        identity={identity}
        tier={tier}
      />

      {view === 'swipe' ? (
        <div className="mx-auto flex min-h-0 w-full max-w-[560px] flex-1 flex-col border-x border-line">
          <SwipeDeck
            cards={remaining}
            spark={spark}
            equity={account.equity}
            risk={swipeRisk}
            leverage={swipeLeverage}
            stepFor={stepFor}
            openPositions={account.positions.length}
            maxPositions={tier.maxPositions}
            onSwipe={onSwipe}
            onPass={(c) => setSwiped((prev) => [...prev, c.symbol])}
            roundLabel={deck.label}
            round={round}
            roundStats={{
              swipes: swiped.length,
              openNow: account.positions.length,
              pnl: account.equity - roundStart.equity,
            }}
            objective={objective}
            objectiveMet={objectiveMet(objective, outcome)}
            session={
              (round + 1) % 5 === 0
                ? {
                    grade: grade(profile.stats, drawdownPct(profile.stats, account.equity)),
                    drawdown: drawdownPct(profile.stats, account.equity),
                    tierName: tier.name,
                    next: nextTier(profile.stats)?.name ?? null,
                  }
                : null
            }
            onNextRound={() => {
              const met = objectiveMet(objective, outcome);
              identity.addProgress({
                rounds: 1,
                xp: met ? objective.xp : 0,
                cleanCloses: outcome.closesInProfit,
                liquidations: outcome.liquidations,
                best: account.stats.best,
                worst: account.stats.worst,
                peak: Math.max(profile.stats.peak, account.equity),
              });
              setRoundBase({ clean: account.stats.cleanCloses, liq: account.stats.liquidations });
              setRound((r) => r + 1);
              setSwiped([]);
              setRoundStart({ equity: account.equity });
            }}
            undo={undo ? { symbol: undo.symbol, side: undo.side } : null}
            onUndo={() => {
              if (!undo) return;
              account.undo(undo.id);
              setSwiped((prev) => prev.filter((s) => s !== undo.symbol));
              setUndo(null);
            }}
          />
        </div>
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto">
          <LiteView
            symbol={symbol}
            info={info}
            mark={markPrice}
            equity={account.equity}
            changePct={mini[symbol]?.pct ?? 0}
            bars={bars}
            interval={interval}
            onInterval={setInterval}
            chartError={error}
            initialRisk={swipeRisk}
            initialLeverage={swipeLeverage}
            maxLeverage={tier.maxLeverage}
            onOpenMarkets={() => setMarketsOpen(true)}
            onPlace={place}
          />
          <div className="mx-auto w-full max-w-[520px] px-3 pb-3">
            <div className="h-[196px] shrink-0 border border-line">{blotter}</div>
          </div>
        </main>
      )}

      <MarketSheet
        open={marketsOpen}
        symbols={symbols}
        tickers={mini}
        watchlist={profile.watchlist}
        value={symbol}
        onPick={(s) => setSymbol(s)}
        onClose={() => setMarketsOpen(false)}
      />
    </div>
  );
}
