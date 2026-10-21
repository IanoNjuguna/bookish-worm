import { useEffect, useState } from 'react';
import { symbolInfo, useSymbols } from './hooks/useSymbols';
import { useTicker } from './hooks/useTicker';
import { useDepth } from './hooks/useDepth';
import { useKlines } from './hooks/useKlines';
import { useMarkPrice, useTrades } from './hooks/useMarket';
import { useMiniTickers } from './hooks/useMiniTickers';
import { Sidebar } from './components/Sidebar';
import { TopBar, type ViewMode } from './components/TopBar';
import { ChartPanel } from './components/Chart';
import { BookPanel } from './components/BookPanel';
import { Ticket } from './components/Ticket';
import { Blotter } from './components/Blotter';
import { LiteView } from './components/LiteView';
import { socket } from './lib/ws';
import { usePaperAccount } from './lib/store';
import type { Interval } from './lib/constants';

const PRO_MIN_WIDTH = 1024;

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
  const [connected, setConnected] = useState(false);

  const wide = useIsWide();
  // Pro needs four rails; below that width the same engine is presented as Lite.
  const view: ViewMode = wide ? mode : 'lite';

  const { symbols } = useSymbols();
  const mini = useMiniTickers();
  const { ticker } = useTicker(symbol);
  const { mark, lastAt } = useMarkPrice(symbol);
  const book = useDepth(symbol);
  const trades = useTrades(symbol);
  const { bars, error } = useKlines(symbol, interval);
  const account = usePaperAccount();

  useEffect(() => {
    socket.connect();
    socket.onState = (s) => setConnected(s === 'open');
    // The socket outlives this component: hooks own their subscriptions by reference
    // count, so tearing it down here would only cause a reconnect storm under
    // StrictMode's double mount.
  }, []);

  const info = symbolInfo(symbols, symbol);
  const last = mini[symbol]?.last ?? Number(ticker?.lastPrice ?? 0);
  const markPrice = Number(mark?.markPrice ?? last);
  const step = Number(info?.filters?.find((f) => f.filterType === 'LOT_SIZE')?.stepSize ?? 1);

  const place = (o: { side: 'LONG' | 'SHORT'; kind: 'limit' | 'market'; price: number; size: number; leverage: number }) =>
    account.place({ ...o, symbol, mark: markPrice, step });

  const blotter = (
    <Blotter
      positions={account.positions}
      orders={account.orders}
      fills={account.fills}
      equity={account.equity}
      mark={markPrice}
      symbol={symbol}
      onClose={account.close}
      onCancel={account.cancel}
    />
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        symbol={symbol}
        ticker={mini[symbol]}
        mark={mark}
        lastAt={lastAt}
        equity={account.equity}
        connected={connected}
        mode={view}
        onMode={setMode}
      />

      {view === 'lite' ? (
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
            onPlace={place}
          />
        </div>
      )}
    </div>
  );
}
