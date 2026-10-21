import { useEffect, useRef } from 'react';
import { createChart, type IChartApi, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts';
import type { Bar } from '../hooks/useKlines';
import { cn } from '../lib/cn';
import { INTERVALS, type Interval } from '../lib/constants';

type Props = { bars: Bar[]; interval: Interval; onInterval: (i: Interval) => void; error: string | null };

/** Candles in the OKX shape: interval strip, no card chrome, chart owns the space. */
export function ChartPanel({ bars, interval, onInterval, error }: Props) {
  const host = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const c = createChart(host.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#8c8c8c',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 11,
        // The default logo renders as a white box on a dark canvas; a credit line in
        // the app footer covers the licence instead.
        attributionLogo: false,
      },
      grid: { vertLines: { color: 'rgba(255,255,255,0.04)' }, horzLines: { color: 'rgba(255,255,255,0.04)' } },
      rightPriceScale: { borderColor: '#1f1f1f', scaleMargins: { top: 0.08, bottom: 0.08 } },
      timeScale: { borderColor: '#1f1f1f', timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
      autoSize: true,
    });

    const s = c.addCandlestickSeries({
      upColor: '#00b47a',
      downColor: '#f0534e',
      wickUpColor: '#00b47a',
      wickDownColor: '#f0534e',
      borderVisible: false,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chart.current = c;
    series.current = s;
    return () => {
      c.remove();
      chart.current = null;
      series.current = null;
    };
  }, []);

  useEffect(() => {
    if (!series.current || !bars.length) return;
    series.current.setData(bars.map((b) => ({ ...b, time: b.time as UTCTimestamp })));
    chart.current?.timeScale().fitContent();
  }, [bars]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-panel">
      <div className="flex items-center gap-0.5 border-b border-line px-1">
        {INTERVALS.map((i) => (
          <button
            key={i}
            onClick={() => onInterval(i)}
            className={cn('tab uppercase', i === interval && 'tab-active')}
          >
            {i}
          </button>
        ))}
        <span className="ml-auto pr-2 text-[10px] text-muted">candles · {bars.length}</span>
      </div>
      <div className="relative flex-1">
        <div ref={host} className="absolute inset-0" />
        {error && <p className="absolute bottom-2 left-2 text-[10px] text-short">{error}</p>}
      </div>
    </section>
  );
}
