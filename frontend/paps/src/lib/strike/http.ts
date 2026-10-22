/**
 * The one module that calls the signing proxy.
 *
 * Every request goes to `/api/strike/<path>`, never to the venue directly: the API wallet
 * key lives in the Worker and the session is an HttpOnly cookie, so `credentials` has to be
 * `same-origin` or the proxy answers 401. Our URLs drop the venue's `/v2` prefix — see
 * `src/server/pages.ts` for why.
 *
 * `strikeGet` deliberately keeps the short `strike 502 code` message for reads, which are
 * retried on a timer and only ever shown as an aside. `strikeSend` surfaces the venue's own
 * words: a refused order has to reach the trader as the exchange wrote it, not as we
 * summarised it.
 */

const PROXY = '/api/strike';

export class VenueError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    /** What the venue or the Worker said, verbatim. Empty when it said nothing usable. */
    readonly venueMessage = '',
  ) {
    super(venueMessage || `strike ${status} ${code}`);
    this.name = 'VenueError';
  }
}

/** 401 means the session or the API wallet behind it is gone; the fix is to connect again. */
export const isReconnect = (e: unknown): boolean =>
  e instanceof VenueError && (e.status === 401 || e.code === 'reconnect');

type ErrorPayload = { error?: unknown; code?: unknown; msg?: unknown };

const readError = async (res: Response): Promise<{ code: string; message: string }> => {
  const payload = (await res.json().catch(() => ({}))) as ErrorPayload;
  const message =
    typeof payload.error === 'string'
      ? payload.error
      : typeof payload.msg === 'string'
        ? payload.msg
        : '';
  return { code: String(payload.code ?? payload.error ?? 'http_error'), message };
};

export async function strikeGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${PROXY}/${path}`, {
    credentials: 'same-origin',
    headers: { accept: 'application/json' },
    signal,
  });
  if (!res.ok) {
    const { code } = await readError(res);
    throw new VenueError(res.status, code);
  }
  return (await res.json()) as T;
}

/**
 * A write. The proxy forwards bodies for POST and DELETE alike, which is what makes
 * `DELETE /v2/order/cancel` with a JSON body work at all.
 */
export async function strikeSend<T>(
  method: 'POST' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${PROXY}/${path}`, {
    method,
    credentials: 'same-origin',
    headers:
      body === undefined
        ? { accept: 'application/json' }
        : { accept: 'application/json', 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    const { code, message } = await readError(res);
    throw new VenueError(res.status, code, message);
  }

  // A 204 has no body, and a cancel that the venue accepted with no payload is still a cancel.
  return (await res.json().catch(() => ({}))) as T;
}
