-- Token buckets for the signing proxy (`/api/strike/*`, per session) and for connect
-- (`/api/connect/*`, per client IP).
--
-- The row is the only state a limit has. That is the point: a counter held in a Worker
-- isolate starts full on every new isolate, so a burst spread across the fleet is admitted
-- as if nothing had happened. Refilling and spending happen in one statement against this
-- table, so two isolates racing cannot both take the last token.
--
-- `tokens` is REAL because a bucket refills continuously: at 240 calls a minute it gains
-- 0.004 of a token per millisecond.
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket TEXT PRIMARY KEY,
  tokens REAL NOT NULL,
  updated_at INTEGER NOT NULL
);

-- For the periodic prune in the README: buckets idle for long enough to be full are only
-- carrying the timestamp.
CREATE INDEX IF NOT EXISTS rate_limit_buckets_updated_at ON rate_limit_buckets (updated_at);
