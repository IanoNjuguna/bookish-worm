import { WS } from './api';
import type { WsEnvelope } from './types';

type Handler = (msg: WsEnvelope) => void;

/**
 * Some channels batch several JSON documents into one frame, separated by newlines.
 * Parsing the frame as a single document silently drops every message after the
 * first, which looks exactly like a feed that only updates some symbols.
 */
function splitDocs(raw: string): unknown[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    return [JSON.parse(trimmed)];
  } catch {
    const out: unknown[] = [];
    for (const line of trimmed.split('\n')) {
      const l = line.trim();
      if (!l) continue;
      try {
        out.push(JSON.parse(l));
      } catch {
        /* ignore a partial line */
      }
    }
    return out;
  }
}
type Sub = { channel: string; symbol: string; refs: number };

/**
 * Public price socket.
 *
 * Subscriptions are reference counted: several hooks watch the same channels, and
 * React's StrictMode mounts effects twice, so a bare subscribe/unsubscribe pair lets
 * one cleanup tear a stream out from under another consumer. Reconnects replay
 * whatever still has a live reference.
 */
export class PriceSocket {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private subs = new Map<string, Sub>();
  private attempt = 0;
  private closedByUs = false;
  private retry: ReturnType<typeof setTimeout> | null = null;

  readonly state: { value: 'idle' | 'open' | 'closed' | 'error' } = { value: 'idle' };
  onState?: (s: 'idle' | 'open' | 'closed' | 'error') => void;

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.closedByUs = false;
    const ws = new WebSocket(WS);
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.set('open');
      for (const sub of this.subs.values()) this.send('subscribe', sub.channel, sub.symbol);
    };

    ws.onmessage = (ev) => {
      const raw = String(ev.data);
      for (const doc of splitDocs(raw)) {
        const msgs = Array.isArray(doc) ? doc : [doc];
        for (const m of msgs) this.dispatch(m as WsEnvelope);
      }
    };

    ws.onclose = () => {
      this.set('closed');
      if (!this.closedByUs) this.scheduleReconnect();
    };

    ws.onerror = () => this.set('error');
  }

  private scheduleReconnect() {
    if (this.retry) clearTimeout(this.retry);
    const delay = Math.min(30_000, 1_000 * 2 ** this.attempt++);
    this.retry = setTimeout(() => this.connect(), delay);
  }

  private set(s: 'idle' | 'open' | 'closed' | 'error') {
    this.state.value = s;
    this.onState?.(s);
  }

  private send(method: 'subscribe' | 'unsubscribe', channel: string, symbol: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    const payload: Record<string, unknown> = { id: Date.now(), method, channel };
    // Broadcast channels take no symbol; a lowercase symbol is required for the rest.
    if (symbol) payload.symbol = symbol.toLowerCase();
    this.ws.send(JSON.stringify(payload));
  }

  private channelOf(msg: WsEnvelope): string {
    const e = (msg as { e?: string }).e;
    if (e === 'depthUpdate') return 'depth';
    if (e === 'markPriceUpdate') return 'markPrice';
    if (e === 'trade') return 'trade';
    if (e === 'kline') return `kline_${(msg as { k?: { i?: string } }).k?.i ?? ''}`;
    if (e === '24hrMiniTicker') return '!miniTicker@arr';
    return e ?? 'unknown';
  }

  private dispatch(msg: WsEnvelope) {
    const channel = this.channelOf(msg);
    this.handlers.get(channel)?.forEach((fn) => fn(msg));
  }

  on(channel: string, fn: Handler): () => void {
    const set = this.handlers.get(channel) ?? new Set<Handler>();
    set.add(fn);
    this.handlers.set(channel, set);
    return () => set.delete(fn);
  }

  subscribe(channel: string, symbol = '') {
    const key = `${channel}:${symbol}`;
    const existing = this.subs.get(key);
    if (existing) {
      existing.refs += 1;
      return;
    }
    this.subs.set(key, { channel, symbol, refs: 1 });
    this.send('subscribe', channel, symbol);
  }

  unsubscribe(channel: string, symbol = '') {
    const key = `${channel}:${symbol}`;
    const sub = this.subs.get(key);
    if (!sub) return;
    sub.refs -= 1;
    if (sub.refs > 0) return;
    this.subs.delete(key);
    this.send('unsubscribe', channel, symbol);
  }

  close() {
    this.closedByUs = true;
    if (this.retry) clearTimeout(this.retry);
    this.ws?.close();
    this.ws = null;
    this.set('closed');
  }
}

export const socket = new PriceSocket();
