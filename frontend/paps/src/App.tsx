import { useEffect, useMemo, useRef, useState } from 'react';
import { symbolInfo, useSymbols } from './hooks/useSymbols';
import { useTicker } from './hooks/useTicker';
import { useDepth } from './hooks/useDepth';
import { useKlines } from './hooks/useKlines';
import { useMarkPrice, useTrades } from './hooks/useMarket';
import { useFundingRates } from './hooks/useFundingRates';
import { useMiniTickers } from './hooks/useMiniTickers';
import { useDeck, type DeckCard } from './hooks/useDeck';
import { useIdentity } from './hooks/useIdentity';
import { useSparklines } from './hooks/useSparklines';
import { Sidebar } from './components/Sidebar';
import { TopBar, type ViewMode } from './components/TopBar';
import { ChartPanel } from './components/Chart';
import { BookPanel } from './components/BookPanel';
import { Ticket } from './components/Ticket';
import { Blotter } from './components/Blotter';
import { LiteView } from './components/LiteView';
import { MarketSheet } from './components/MarketSheet';
import { SwipeDeck } from './components/SwipeDeck';
import { socket } from './lib/ws';
import { START_EQUITY, usePaperAccount } from './lib/store';
import type { Interval } from './lib/constants';
import { fundingWindowKey } from './lib/funding';
import { liquidationPrice, type Side } from './lib/order';

const PRO_MIN_WIDTH = 1024;
const FALLBACK_RISK = 100;
const FALLBACK_LEVERAGE = 10;
const MAX_POSITIONS = 5;
const DECK_SIZE = 10;
const UNDO_MS = 2_000;

function useIsWide() {
  const [wide, setWide] = useState(() => window.innerWidth >= PRO_MIN_WIDTH);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${PRO_MIN_WIDTH}px)`);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

export default function App() {
  const [symbol, setSymbol] = useState('ADA-USD');
  const [interval, setInterval] = useState<Interval>('15m');
  const [picked, setPicked] = useState('');
  const [mode, setMode] = useState<ViewMode>('pro');
  const [modeTouched, setModeTouched] = useState(false);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [round, setRound] = useState(0);
  const [roundStart, setRoundStart] = useState({ equity: START_EQUITY, openBase: 0 });
  const [connected, setConnected] = useState(false);
  const [swiped, setSwiped] = useState<string[]>([]);
  const [undo, setUndo] = useState<{ id: string; symbol: string; side: Side } | null>(null);

  const wide = useIsWide();
  // Pro needs four rails; narrower screens get the two views that actually fit.
  const modes: ViewMode[] = wide ? ['pro', 'lite', 'swipe'] : ['lite', 'swipe'];
  const view: ViewMode = modes.includes(mode) ? mode : modes[0];

  const { symbols } = useSymbols();
  const mini = useMiniTickers();
  const { ticker } = useTicker(symbol);
  const { mark, lastAt } = useMarkPrice(symbol);
  const book = useDepth(symbol);
  const trades = useTrades(symbol);
  const { bars, error } = useKlines(symbol, interval);
  const account = usePaperAccount();
  const identity = useIdentity();
  const profile = identity.profile;
  const swipeRisk = profile.riskUsd || FALLBACK_RISK;
  const swipeLeverage = profile.leverage || FALLBACK_LEVERAGE;
  const deck = useDeck(symbols, mini, DECK_SIZE, profile.watchlist, round);
  // Funding is per market, so the rate subscription follows the positions rather than
  // the chart: a position in a market you are not looking at still pays. The market on
  // screen joins them, because the ticket has to price a trade before it exists.
  const heldSymbols = useMemo(() => account.positions.map((p) => p.symbol), [account.positions]);
  const funding = useFundingRates(useMemo(() => [symbol, ...heldSymbols], [symbol, heldSymbols]));
  const settled = useRef<Set<string>>(new Set());

  useEffect(() => {
    socket.connect();
    socket.onState = (s) => setConnected(s === 'open');
    // The socket outlives this component: hooks own their subscriptions by reference
    // count, so tearing it down here would only cause a reconnect storm under
    // StrictMode's double mount.
  }, []);

  useEffect(() => {
    // The profile decides where the app opens, until the trader touches the switcher.
    if (!modeTouched && modes.includes(profile.defaultView)) setMode(profile.defaultView);
  }, [profile.defaultView, modeTouched, modes]);

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
  }, [marks, account.positions]);

  useEffect(() => {
    if (!account.positions.length) return;
    const settle = () => {
      const now = Date.now();
      for (const p of account.positions) {
        const f = funding[p.symbol];
        if (!f || now < f.settleAt) continue;
        const key = fundingWindowKey(p.symbol, f.settleAt);
        // One charge per window: a re-render, a repeated mark line or StrictMode's double
        // mount must not bill the same settlement twice.
        if (settled.current.has(key)) continue;
        settled.current.add(key);
        account.fund(p.symbol, f.rate, marks[p.symbol] ?? p.entry);
      }
    };
    settle();
    const id = window.setInterval(settle, 1_000);
    return () => window.clearInterval(id);
    // `fund` is a stable dispatcher; the positions and the marks are what change.
  }, [funding, account.positions, marks, account.fund]);

  const remaining = useMemo(() => {
    const left = deck.cards.filter((c) => !swiped.includes(c.symbol));
    // A trader's own markets come first; the rank order is only the default.
    const watched = left.filter((c) => profile.watchlist.includes(c.symbol));
    return [...watched, ...left.filter((c) => !profile.watchlist.includes(c.symbol))];
  }, [deck.cards, swiped, profile.watchlist]);
  const spark = useSparklines(remaining.slice(0, 4).map((c) => c.symbol));

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
            maxPositions={MAX_POSITIONS}
            onSwipe={onSwipe}
            onPass={(c) => setSwiped((prev) => [...prev, c.symbol])}
            roundLabel={deck.label}
            round={round}
            roundStats={{
              swipes: swiped.length,
              openNow: account.positions.length,
              pnl: account.equity - roundStart.equity,
            }}
            onNextRound={() => {
              setRound((r) => r + 1);
              setSwiped([]);
              setRoundStart({ equity: account.equity, openBase: account.positions.length });
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
      ) : view === 'lite' ? (
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
            fundingRate={funding[symbol]?.rate}
            onOpenMarkets={() => setMarketsOpen(true)}
            onPlace={place}
          />
          <div className="mx-auto w-full max-w-[520px] px-3 pb-3">
            <div className="h-[196px] shrink-0 border border-line">{blotter}</div>
          </div>
        </main>
      ) : (
        <div className="flex min-h-0 flex-1">
          <Sidebar
            symbols={symbols}
            tickers={mini}
            value={symbol}
            onPick={(s) => {
              setSymbol(s);
              setPicked('');
            }}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <ChartPanel bars={bars} interval={interval} onInterval={setInterval} error={error} />
            <div className="h-[214px] shrink-0">{blotter}</div>
          </div>

          <div className="hidden w-[236px] shrink-0 flex-col xl:flex">
            <BookPanel
              bids={book.bids}
              asks={book.asks}
              trades={trades}
              status={book.status}
              nextFundingIn={mark ? Math.max(0, mark.nextFundingTime - Date.now()) : 0}
              onPick={setPicked}
            />
          </div>

          <Ticket
            symbol={symbol}
            info={info}
            mark={markPrice}
            picked={picked}
            equity={account.equity}
            fundingRate={funding[symbol]?.rate}
            onPlace={place}
          />
        </div>
      )}

      <MarketSheet
        open={marketsOpen}
        symbols={symbols}
        tickers={mini}
        watchlist={profile.watchlist}
        value={symbol}
        onPick={(s) => {
          setSymbol(s);
          setPicked('');
        }}
        onClose={() => setMarketsOpen(false)}
      />
    </div>
  );
}
