/**
 * Two strings a deposit screen needs and no one else does.
 *
 * `countdown` is millimetres of the quote's life: it is shown next to the address, and it has to
 * read the same on every tick, so it is fixed width rather than "about a minute". When the venue
 * stated no expiry the screen says so instead of inventing a limit.
 */

/** `m:ss` under an hour, `h:mm:ss` above it. Always two digits on the seconds. */
export function countdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1_000));
  const hours = Math.floor(total / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  const seconds = total % 60;
  const sec = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${sec}` : `${minutes}:${sec}`;
}

/** A transaction hash, whole. A deposit receipt is the one place it is not abbreviated. */
export const fullHash = (hash: string): string => hash.trim();
