import { logger } from './lib/logger'
import { createClient } from '@libsql/client'
import { randomBytes } from 'crypto'
import { getCollectorsCountOnChain } from './web3'

const url = process.env.TURSO_URL || 'file:doba.db'
const authToken = process.env.TURSO_AUTH_TOKEN

// Initialize LibSQL client (local or remote)
const db = createClient({
  url: url,
  authToken: authToken,
})

// Initialize tables
async function init() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tracks (
      token_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      artist TEXT NOT NULL,
      genre TEXT,
      duration TEXT,
      release_date TEXT,
      image_url TEXT,
      audio_url TEXT,
      external_url TEXT,
      streaming_url TEXT,
      price TEXT,
      max_supply TEXT,
      supply_capped INTEGER DEFAULT 0,
      splitter TEXT,
      tx_hash TEXT,
      uploader_address TEXT,
      album_id INTEGER,
      track_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  try {
    await db.execute('ALTER TABLE tracks ADD COLUMN album_id INTEGER')
  } catch (e) { /* ignore if column already exists */ }
  try {
    await db.execute('ALTER TABLE tracks ADD COLUMN track_number INTEGER')
  } catch (e) { /* ignore if column already exists */ }

  // 0 = the minting policy enforces no cap (legacy releases), 1 = cap is on-chain
  try {
    await db.execute('ALTER TABLE tracks ADD COLUMN supply_capped INTEGER DEFAULT 0')
  } catch (e) { /* ignore if column already exists */ }

  try {
    await db.execute('ALTER TABLE users ADD COLUMN artist_mode INTEGER DEFAULT 0')
  } catch (e) { /* ignore if column already exists */ }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      address TEXT PRIMARY KEY,
      username TEXT,
      bio TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'user',
      artist_mode INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id INTEGER NOT NULL,
      wallet_address TEXT NOT NULL,
      split_percentage REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id),
      UNIQUE(track_id, wallet_address)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS mints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      track_id INTEGER NOT NULL,
      tx_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id),
      UNIQUE(user_address, track_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      user_address TEXT NOT NULL,
      family TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      revoked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_address) REFERENCES users(address)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id INTEGER NOT NULL,
      listener_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(track_id) REFERENCES tracks(token_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS auth_nonces (
      nonce TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_plays_track_id ON plays(track_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_mints_track_id ON mints(track_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_auth_nonces_expires ON auth_nonces(expires_at)`)

  // --- metrics foundation (#26) ---
  // Money on the collect, recorded when it happened rather than derived later.
  // fee_lovelace is what the treasury actually received; price_lovelace is what
  // the buyer actually paid. Neither may be computed from tracks.price.
  const mintColumns: [string, string][] = [
    ['price_lovelace', 'INTEGER'],
    ['fee_lovelace', 'INTEGER'],
    ['currency', "TEXT DEFAULT 'ADA'"],
    ['kind', "TEXT DEFAULT 'primary'"],
    ['seller', 'TEXT'],
  ]
  for (const [name, type] of mintColumns) {
    try {
      await db.execute(`ALTER TABLE mints ADD COLUMN ${name} ${type}`)
    } catch (e) {
      /* column already exists */
    }
  }

  // fee_bps is a per-splitter validator parameter, so the intended rate is
  // recorded per track; status carries delisting without deleting rows.
  const trackMetricColumns: [string, string][] = [
    ['fee_bps', 'INTEGER'],
    ['status', "TEXT DEFAULT 'published'"],
  ]
  for (const [name, type] of trackMetricColumns) {
    try {
      await db.execute(`ALTER TABLE tracks ADD COLUMN ${name} ${type}`)
    } catch (e) {
      /* column already exists */
    }
  }

  // Silent failures need somewhere to land. Three kinds today; the dashboard's
  // health strip reads only these.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL,
      subject TEXT,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_plays_time ON plays(timestamp)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_mints_time ON mints(created_at)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_events_kind_time ON events(kind, created_at)`)

  // One row per EAT day. The dashboard's series read this, never raw plays.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS metrics_daily (
      day TEXT PRIMARY KEY,
      collects INTEGER NOT NULL DEFAULT 0,
      gmv_lovelace INTEGER NOT NULL DEFAULT 0,
      take_lovelace INTEGER NOT NULL DEFAULT 0,
      unpriced_collects INTEGER NOT NULL DEFAULT 0,
      plays INTEGER NOT NULL DEFAULT 0,
      listeners INTEGER NOT NULL DEFAULT 0,
      collectors INTEGER NOT NULL DEFAULT 0,
      failed_collects INTEGER NOT NULL DEFAULT 0,
      chain_fallbacks INTEGER NOT NULL DEFAULT 0,
      api_5xx INTEGER NOT NULL DEFAULT 0,
      refreshed_at DATETIME
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      name TEXT,
      type TEXT NOT NULL,
      data_json TEXT NOT NULL,
      audio_hash TEXT,
      image_hash TEXT,
      audio_filename TEXT,
      image_filename TEXT,
      streaming_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Simple migrations
  const trackColumns = ['price', 'max_supply', 'splitter', 'tx_hash', 'uploader_address', 'uploader_payment_address', 'chain_id', 'streaming_url', 'ticker']
  for (const col of trackColumns) {
    try {
      await db.execute(`ALTER TABLE tracks ADD COLUMN ${col} TEXT`)
    } catch (e) {
      // Column probably already exists
    }
  }

  const userColumns = ['role']
  for (const col of userColumns) {
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN ${col} TEXT DEFAULT 'user'`)
    } catch (e: any) {
      if (!e.message.includes('already exists') && !e.message.includes('duplicate column name')) {
        logger.error(`Migration failed for column ${col}`, e.message)
      }
    }
  }
  logger.info(`Database initialized (${url.startsWith('file:') ? 'Local' : 'Turso'})`)
}

init().catch(err => logger.error('Database initialization failed', err))

export interface Track {
  token_id: number
  name: string
  ticker?: string
  description?: string
  artist: string
  genre?: string
  duration?: string
  release_date?: string
  image_url?: string
  audio_url?: string
  streaming_url?: string
  external_url?: string
  price?: string
  max_supply?: string
  supply_capped?: number | boolean
  splitter?: string
  tx_hash?: string
  uploader_address?: string
  uploader_payment_address?: string
  chain_id?: string
  play_count?: number
  /** Computed per row by the list queries, not a column on tracks. */
  mint_count?: number
  album_id?: number
  track_number?: number
}

export interface User {
  address: string
  username?: string
  bio?: string
  avatar_url?: string
  role?: 'admin' | 'user'
  artist_mode?: boolean | number
}

export interface Collaborator {
  id?: number
  track_id: number
  wallet_address: string
  split_percentage: number
}

export interface RefreshToken {
  token: string
  user_address: string
  family: string
  expires_at: number
  revoked: boolean
}

export interface Draft {
  id: number
  user_address: string
  name?: string
  type: 'single' | 'album'
  data_json: string
  audio_hash?: string
  image_hash?: string
  audio_filename?: string
  image_filename?: string
  streaming_url?: string
  created_at: string
  updated_at: string
}

export interface DraftInput {
  name?: string
  type: 'single' | 'album'
  data_json: string
  audio_hash?: string
  image_hash?: string
  audio_filename?: string
  image_filename?: string
  streaming_url?: string
}

export async function getTrack(tokenId: number): Promise<Track | null> {
  const rs = await db.execute({
    sql: `
      SELECT *, 
             (SELECT COUNT(*) FROM plays p WHERE p.track_id = token_id) as play_count,
             (SELECT COUNT(*) FROM mints m WHERE m.track_id = token_id) as mint_count,
             (SELECT name FROM tracks t2 WHERE t2.token_id = tracks.album_id) as album_name
      FROM tracks 
      WHERE token_id = ?
    `,
    args: [tokenId]
  })
  return rs.rows[0] as unknown as Track | null
}

export async function addTrack(track: Track): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO tracks (token_id, name, ticker, description, artist, genre, duration, release_date, image_url, audio_url, streaming_url, external_url, price, max_supply, supply_capped, splitter, tx_hash, uploader_address, uploader_payment_address, chain_id, album_id, track_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(token_id) DO UPDATE SET
        name = excluded.name,
        ticker = excluded.ticker,
        description = excluded.description,
        artist = excluded.artist,
        genre = excluded.genre,
        duration = excluded.duration,
        release_date = excluded.release_date,
        image_url = excluded.image_url,
        audio_url = excluded.audio_url,
        streaming_url = excluded.streaming_url,
        external_url = excluded.external_url,
        price = excluded.price,
        max_supply = excluded.max_supply,
        supply_capped = excluded.supply_capped,
        splitter = excluded.splitter,
        tx_hash = excluded.tx_hash,
        uploader_address = excluded.uploader_address,
        uploader_payment_address = excluded.uploader_payment_address,
        chain_id = excluded.chain_id,
        album_id = excluded.album_id,
        track_number = excluded.track_number
    `,
    args: [
      track.token_id,
      track.name,
      track.ticker ?? null,
      track.description ?? null,
      track.artist,
      track.genre ?? null,
      track.duration ?? null,
      track.release_date ?? null,
      track.image_url ?? null,
      track.audio_url ?? null,
      track.streaming_url ?? null,
      track.external_url ?? null,
      track.price ?? null,
      track.max_supply ?? null,
      track.supply_capped ? 1 : 0,
      track.splitter ?? null,
      track.tx_hash ?? null,
      track.uploader_address ?? null,
      track.uploader_payment_address ?? null,
      track.chain_id ?? null,
      track.album_id ?? null,
      track.track_number ?? null
    ]
  })
}

export interface TrackFilters {
  artist?: string
  genre?: string
  search?: string
  limit?: number
  offset?: number
  album_id?: number
}

export async function getAllTracks(filters: TrackFilters = {}): Promise<Track[]> {
  const { artist, genre, search, limit, offset, album_id } = filters
  const conditions: string[] = []
  const args: any[] = []

  if (artist) {
    conditions.push('(artist = ? OR artist COLLATE NOCASE = ? OR uploader_address = ? OR uploader_address COLLATE NOCASE = ? OR uploader_payment_address = ? OR uploader_payment_address COLLATE NOCASE = ?)')
    args.push(artist, artist, artist, artist, artist, artist)
  }

  if (genre) {
    conditions.push('genre = ?')
    args.push(genre)
  }

  if (search) {
    conditions.push('(name LIKE ? OR artist LIKE ?)')
    const searchPattern = `%${search}%`
    args.push(searchPattern, searchPattern)
  }

  if (album_id !== undefined) {
    conditions.push('album_id = ?')
    args.push(album_id)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  let sql = `
    SELECT *, 
           (SELECT COUNT(*) FROM plays p WHERE p.track_id = token_id) as play_count,
           (SELECT COUNT(*) FROM mints m WHERE m.track_id = token_id) as mint_count
    FROM tracks 
    ${where} 
    ORDER BY token_id DESC
  `

  if (limit !== undefined) {
    sql += ` LIMIT ?`
    args.push(limit)
    if (offset !== undefined) {
      sql += ` OFFSET ?`
      args.push(offset)
    }
  }

  const rs = await db.execute({ sql, args })
  return rs.rows as unknown as Track[]
}

export async function deleteTrack(tokenId: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM tracks WHERE token_id = ?',
    args: [tokenId]
  })
}

export async function addMint(mint: {
  user_address: string
  track_id: number
  tx_hash?: string
  price_lovelace?: number | null
  fee_lovelace?: number | null
  currency?: string
  kind?: string
  seller?: string | null
}): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO mints (user_address, track_id, tx_hash, price_lovelace, fee_lovelace, currency, kind, seller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_address, track_id) DO UPDATE SET
        tx_hash = excluded.tx_hash,
        price_lovelace = COALESCE(excluded.price_lovelace, mints.price_lovelace),
        fee_lovelace = COALESCE(excluded.fee_lovelace, mints.fee_lovelace),
        currency = COALESCE(excluded.currency, mints.currency),
        kind = COALESCE(excluded.kind, mints.kind),
        seller = COALESCE(excluded.seller, mints.seller)
    `,
    args: [
      String(mint.user_address).toLowerCase(),
      mint.track_id,
      mint.tx_hash ?? null,
      mint.price_lovelace ?? null,
      mint.fee_lovelace ?? null,
      mint.currency ?? 'ADA',
      mint.kind ?? 'primary',
      mint.seller ? String(mint.seller).toLowerCase() : null,
    ]
  })
}

export async function setMintAmounts(
  userAddress: string,
  trackId: number,
  amounts: { priceLovelace: number | null; feeLovelace: number | null }
): Promise<void> {
  await db.execute({
    sql: `UPDATE mints SET price_lovelace = ?, fee_lovelace = ?
          WHERE user_address = ? AND track_id = ?`,
    args: [
      amounts.priceLovelace,
      amounts.feeLovelace,
      String(userAddress).toLowerCase(),
      trackId,
    ]
  })
}

/** Rows whose chain money has never been read, for the backfill script. */
export async function getUnpricedMints(): Promise<
  { user_address: string; track_id: number; tx_hash: string; created_at: string }[]
> {
  const rs = await db.execute(`
    SELECT user_address, track_id, tx_hash, created_at FROM mints
    WHERE tx_hash IS NOT NULL AND price_lovelace IS NULL
    ORDER BY created_at
  `)
  return rs.rows as any[]
}

export type EventKind = 'collect_failed' | 'collect_unpriced' | 'chain_fallback' | 'http_5xx'

/** Append-only. The dashboard's health strip reads only this table. */
export async function recordEvent(kind: EventKind, subject: string, detail?: string): Promise<void> {
  try {
    await db.execute({
      sql: 'INSERT INTO events (kind, subject, detail) VALUES (?, ?, ?)',
      args: [kind, subject, detail ?? null]
    })
  } catch (error) {
    // Never let telemetry break the request it is describing.
    logger.error(`Failed to record event ${kind}`, error)
  }
}

export async function countEventsSince(kind: EventKind, sinceDays: number): Promise<number> {
  const rs = await db.execute({
    sql: `SELECT COUNT(*) AS n FROM events WHERE kind = ? AND created_at >= datetime('now', ?)`,
    args: [kind, `-${sinceDays} days`]
  })
  return Number((rs.rows[0] as any).n)
}

export async function getUserMints(userAddress: string): Promise<number[]> {
  const rs = await db.execute({
    sql: 'SELECT track_id FROM mints WHERE user_address = ?',
    args: [String(userAddress).toLowerCase()]
  })
  return rs.rows.map(row => Number(row.track_id))
}

export async function deleteAllTracks(): Promise<void> {
  await db.execute('DELETE FROM tracks')
}

// User Methods
export async function getUser(address: string): Promise<User | null> {
  const rs = await db.execute({
    sql: 'SELECT * FROM users WHERE address = ?',
    args: [address]
  })
  return rs.rows[0] as unknown as User | null
}

export async function addUser(user: User): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO users (address, username, bio, avatar_url, role, artist_mode)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(address) DO UPDATE SET
        username = excluded.username,
        bio = excluded.bio,
        avatar_url = excluded.avatar_url,
        role = COALESCE(excluded.role, users.role),
        artist_mode = COALESCE(excluded.artist_mode, users.artist_mode)
    `,
    args: [
      user.address,
      user.username ?? null,
      user.bio ?? null,
      user.avatar_url ?? null,
      user.role ?? 'user',
      user.artist_mode === true || user.artist_mode === 1 ? 1 : 0
    ]
  })
}

export async function isAdmin(address: string): Promise<boolean> {
  if (!address) return false
  const user = await getUser(address)
  return user?.role === 'admin'
}

// Collaborator Methods
export async function getTrackCollaborators(trackId: number): Promise<Collaborator[]> {
  const rs = await db.execute({
    sql: 'SELECT * FROM collaborators WHERE track_id = ?',
    args: [trackId]
  })
  return rs.rows as unknown as Collaborator[]
}

export async function addCollaborator(collab: Collaborator): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO collaborators (track_id, wallet_address, split_percentage)
      VALUES (?, ?, ?)
      ON CONFLICT(track_id, wallet_address) DO UPDATE SET
        split_percentage = excluded.split_percentage
    `,
    args: [
      collab.track_id,
      collab.wallet_address,
      collab.split_percentage
    ]
  })
}

export async function deleteTrackCollaborators(trackId: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM collaborators WHERE track_id = ?',
    args: [trackId]
  })
}

// Refresh Token Methods
export async function addRefreshToken(rt: RefreshToken): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO refresh_tokens (token, user_address, family, expires_at) VALUES (?, ?, ?, ?)',
    args: [rt.token, rt.user_address, rt.family, rt.expires_at]
  })
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  const rs = await db.execute({
    sql: 'SELECT * FROM refresh_tokens WHERE token = ?',
    args: [token]
  })
  if (!rs.rows[0]) return null
  const row = rs.rows[0] as any
  return {
    token: row.token,
    user_address: row.user_address,
    family: row.family,
    expires_at: row.expires_at,
    revoked: Boolean(row.revoked)
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE refresh_tokens SET revoked = 1 WHERE token = ?',
    args: [token]
  })
}

export async function revokeRefreshTokenFamily(family: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE refresh_tokens SET revoked = 1 WHERE family = ?',
    args: [family]
  })
}

// Auth Nonce Methods
export async function createAuthNonce(address: string): Promise<string> {
  // Industry standard 256-bit CSPRNG for cryptographic nonces
  const nonce = randomBytes(32).toString('hex')
  const expiresAt = Math.floor(Date.now() / 1000) + 300 // 5 minutes
  await db.execute({
    sql: 'INSERT INTO auth_nonces (nonce, address, expires_at) VALUES (?, ?, ?)',
    args: [nonce, address, expiresAt]
  })
  return nonce
}

export async function consumeAuthNonce(nonce: string, address: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000)
  // Atomic UPDATE to prevent TOCTOU (Time-of-check to time-of-use) race conditions
  const rs = await db.execute({
    sql: 'UPDATE auth_nonces SET used = 1 WHERE nonce = ? AND address = ? AND used = 0 AND expires_at > ?',
    args: [nonce, address, now]
  })
  return rs.rowsAffected > 0
}

export async function cleanupExpiredNonces(): Promise<void> {
  const now = Math.floor(Date.now() / 1000)
  await db.execute({
    sql: 'DELETE FROM auth_nonces WHERE expires_at < ?',
    args: [now]
  })
}

// Analytics Methods
export async function addPlay(trackId: number, listenerAddress?: string): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO plays (track_id, listener_address) VALUES (?, ?)',
    args: [trackId, listenerAddress?.toLowerCase() ?? null]
  })
}

export type TimelineDay = {
  /** Calendar day in EAT (UTC+3, no DST), the bucket every dashboard day means. */
  day: string;
  collects: number;
  plays: number;
};

export type Overview = {
  days: number;
  fans: { collectors: number; listeners: number; total: number; zeroRevenue: number };
  money: {
    collects: number;
    gmvLovelace: number;
    takeLovelace: number;
    averagePriceLovelace: number | null;
    spendPerFanLovelace: number | null;
    takePerFanLovelace: number | null;
    medianSpendLovelace: number | null;
    topFanShare: number | null;
    unpricedCollects: number;
  };
  levers: {
    collectsPerFan: number | null;
    releasesWithCollects: number;
    releases: number;
  };
  health: { unpricedCollects: number; collectFailed: number; chainFallbacks: number; api5xx: number };
};

/**
 * The Overview's numbers for one window.
 *
 * Read directly from the tables rather than from `metrics_daily`, because at this
 * catalogue size a windowed aggregate is a single indexed scan; the rollup exists
 * for the *series* (heatmap, weekly line), where the cost is per-day not per-window.
 * The shape of this object is the contract with the admin app.
 *
 * Every per-fan figure is computed over the union of listeners and collectors, so
 * an audience that grows without collecting visibly pulls take per fan down.
 */
export async function getOverview(days = 30): Promise<Overview> {
  const span = Math.min(Math.max(Math.trunc(days) || 30, 1), 365);
  const offset = `-${span} days`;

  const perFan = await db.execute({
    sql: `
      WITH window_mints AS (
        SELECT user_address, price_lovelace, fee_lovelace
        FROM mints WHERE created_at >= datetime('now', ?) AND kind = 'primary'
      ),
      collectors AS (SELECT DISTINCT user_address AS a FROM window_mints),
      listeners AS (
        SELECT DISTINCT listener_address AS a FROM plays
        WHERE listener_address IS NOT NULL AND timestamp >= datetime('now', ?)
      ),
      fans AS (SELECT a FROM collectors UNION SELECT a FROM listeners),
      per_fan AS (
        SELECT f.a,
               COALESCE((SELECT SUM(price_lovelace) FROM window_mints m WHERE m.user_address = f.a), 0) AS spend,
               COALESCE((SELECT SUM(fee_lovelace) FROM window_mints m WHERE m.user_address = f.a), 0) AS fee
        FROM fans f
      ),
      ranked AS (
        SELECT spend, ROW_NUMBER() OVER (ORDER BY spend) AS rn, COUNT(*) OVER () AS n FROM per_fan
      )
      SELECT
        (SELECT COUNT(*) FROM fans)                                   AS fans,
        (SELECT COUNT(*) FROM collectors)                              AS collectors,
        (SELECT COUNT(*) FROM listeners)                               AS listeners,
        (SELECT COUNT(*) FROM fans WHERE a NOT IN (SELECT a FROM collectors)) AS zero_revenue,
        (SELECT COUNT(*) FROM window_mints)                            AS collects,
        (SELECT COALESCE(SUM(price_lovelace), 0) FROM window_mints)    AS gmv,
        (SELECT COALESCE(SUM(fee_lovelace), 0) FROM window_mints)      AS take,
        (SELECT COUNT(*) FROM window_mints WHERE price_lovelace IS NULL) AS unpriced,
        (SELECT AVG(price_lovelace) FROM window_mints WHERE price_lovelace IS NOT NULL) AS avg_price,
        (SELECT spend FROM ranked WHERE rn = (n + 1) / 2)              AS median_spend,
        (SELECT MAX(spend) * 1.0 / NULLIF(SUM(spend), 0) FROM per_fan) AS top_share,
        (SELECT COUNT(DISTINCT track_id) FROM mints WHERE created_at >= datetime('now', ?)) AS releases_with_collects,
        (SELECT COUNT(*) FROM tracks WHERE COALESCE(status, 'published') = 'published')    AS releases
    `,
    args: [offset, offset, offset],
  });

  const r = perFan.rows[0] as any;
  const fans = Number(r.fans);
  const gmv = Number(r.gmv);
  const take = Number(r.take);
  const collects = Number(r.collects);

  return {
    days: span,
    fans: {
      collectors: Number(r.collectors),
      listeners: Number(r.listeners),
      total: fans,
      zeroRevenue: Number(r.zero_revenue),
    },
    money: {
      collects,
      gmvLovelace: gmv,
      takeLovelace: take,
      averagePriceLovelace: r.avg_price === null ? null : Number(r.avg_price),
      spendPerFanLovelace: fans > 0 ? Math.round(gmv / fans) : null,
      takePerFanLovelace: fans > 0 ? Math.round(take / fans) : null,
      medianSpendLovelace: r.median_spend === null ? null : Number(r.median_spend),
      topFanShare: r.top_share === null ? null : Number(r.top_share),
      unpricedCollects: Number(r.unpriced),
    },
    levers: {
      collectsPerFan: fans > 0 ? collects / fans : null,
      releasesWithCollects: Number(r.releases_with_collects),
      releases: Number(r.releases),
    },
    health: {
      unpricedCollects: Number(r.unpriced),
      collectFailed: await countEventsSince('collect_failed', span),
      chainFallbacks: await countEventsSince('chain_fallback', span),
      api5xx: await countEventsSince('http_5xx', span),
    },
  };
}

/**
 * Rebuild `metrics_daily` for the last `days` days (default 3: late writes, clock
 * skew, a missed tick). Upsert, so running it twice is a no-op, and bucketed by EAT
 * day for the same reason the timeline is.
 */
export async function rollupDays(days = 3): Promise<{ days: number; rows: number }> {
  const span = Math.min(Math.max(Math.trunc(days) || 3, 1), 90);
  let rows = 0;

  for (let i = 0; i < span; i++) {
    // EAT day label for `i` days ago; the same arithmetic the timeline uses.
    const day = new Date(Date.now() + 3 * 3600_000 - i * 86_400_000).toISOString().slice(0, 10);

    const rs = await db.execute({
      sql: `
        SELECT
          (SELECT COUNT(*) FROM mints WHERE date(created_at, '+3 hours') = ?) AS collects,
          (SELECT COALESCE(SUM(price_lovelace), 0) FROM mints WHERE date(created_at, '+3 hours') = ?) AS gmv,
          (SELECT COALESCE(SUM(fee_lovelace), 0) FROM mints WHERE date(created_at, '+3 hours') = ?) AS take,
          (SELECT COUNT(*) FROM mints
             WHERE date(created_at, '+3 hours') = ? AND price_lovelace IS NULL) AS unpriced,
          (SELECT COUNT(*) FROM plays WHERE date(timestamp, '+3 hours') = ?) AS plays,
          (SELECT COUNT(DISTINCT listener_address) FROM plays
             WHERE date(timestamp, '+3 hours') = ? AND listener_address IS NOT NULL) AS listeners,
          (SELECT COUNT(DISTINCT user_address) FROM mints WHERE date(created_at, '+3 hours') = ?) AS collectors,
          (SELECT COUNT(*) FROM events
             WHERE kind = 'collect_failed' AND date(created_at, '+3 hours') = ?) AS failed,
          (SELECT COUNT(*) FROM events
             WHERE kind = 'chain_fallback' AND date(created_at, '+3 hours') = ?) AS fallbacks,
          (SELECT COUNT(*) FROM events
             WHERE kind = 'http_5xx' AND date(created_at, '+3 hours') = ?) AS api_5xx
      `,
      args: [day, day, day, day, day, day, day, day, day, day],
    });

    const r = rs.rows[0] as any;
    await db.execute({
      sql: `
        INSERT INTO metrics_daily
          (day, collects, gmv_lovelace, take_lovelace, unpriced_collects, plays, listeners,
           collectors, failed_collects, chain_fallbacks, api_5xx, refreshed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(day) DO UPDATE SET
          collects = excluded.collects,
          gmv_lovelace = excluded.gmv_lovelace,
          take_lovelace = excluded.take_lovelace,
          unpriced_collects = excluded.unpriced_collects,
          plays = excluded.plays,
          listeners = excluded.listeners,
          collectors = excluded.collectors,
          failed_collects = excluded.failed_collects,
          chain_fallbacks = excluded.chain_fallbacks,
          api_5xx = excluded.api_5xx,
          refreshed_at = CURRENT_TIMESTAMP
      `,
      args: [
        day,
        Number(r.collects),
        Number(r.gmv),
        Number(r.take),
        Number(r.unpriced),
        Number(r.plays),
        Number(r.listeners),
        Number(r.collectors),
        Number(r.failed),
        Number(r.fallbacks),
        Number(r.api_5xx),
      ],
    });
    rows += 1;
  }

  return { days: span, rows };
}

export async function getTimeline(days = 84): Promise<TimelineDay[]> {
  const span = Math.min(Math.max(Math.trunc(days) || 84, 7), 365);
  const offset = `-${span} days`;

  const [collects, plays] = await Promise.all([
    db.execute({
      sql: `SELECT date(created_at, '+3 hours') AS day, COUNT(*) AS n
            FROM mints WHERE created_at >= datetime('now', ?) GROUP BY day`,
      args: [offset],
    }),
    db.execute({
      sql: `SELECT date(timestamp, '+3 hours') AS day, COUNT(*) AS n
            FROM plays WHERE timestamp >= datetime('now', ?) GROUP BY day`,
      args: [offset],
    }),
  ]);

  const byDay = new Map<string, TimelineDay>();
  const eatToday = new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);

  for (let i = span - 1; i >= 0; i--) {
    const day = new Date(Date.parse(`${eatToday}T00:00:00Z`) - i * 86_400_000)
      .toISOString()
      .slice(0, 10);
    byDay.set(day, { day, collects: 0, plays: 0 });
  }

  for (const row of collects.rows as any[]) {
    const entry = byDay.get(String(row.day));
    if (entry) entry.collects = Number(row.n);
  }
  for (const row of plays.rows as any[]) {
    const entry = byDay.get(String(row.day));
    if (entry) entry.plays = Number(row.n);
  }

  return Array.from(byDay.values());
}

export async function getAnalytics(artistAddress: string): Promise<any> {
  // Get all tracks for this artist
  const tracks = await getAllTracks({ artist: artistAddress })
  const trackIds = tracks.map(t => t.token_id)

  if (trackIds.length === 0) {
    return {
      totalPlays: 0,
      uniqueListeners: 0,
      totalCollectors: 0,
      playsOverTime: [],
      topTracks: []
    }
  }

  const idsPlaceholder = trackIds.map(() => '?').join(',')

  // Total Plays
  const playsRs = await db.execute({
    sql: `SELECT COUNT(*) as count FROM plays WHERE track_id IN (${idsPlaceholder})`,
    args: trackIds
  })
  const totalPlays = Number(playsRs.rows[0].count)

  // Unique Listeners
  const listenersRs = await db.execute({
    sql: `SELECT COUNT(DISTINCT listener_address) as count FROM plays WHERE track_id IN (${idsPlaceholder}) AND listener_address IS NOT NULL`,
    args: trackIds
  })
  const uniqueListeners = Number(listenersRs.rows[0].count)

  // Total Collectors (On-chain verified + DB fallback)
  let totalCollectors = 0
  for (const track of tracks) {
    if (track.splitter) {
      try {
        const onChainCollectors = await getCollectorsCountOnChain(track.splitter, track.ticker || '', track.token_id)
        if (onChainCollectors !== null) {
          totalCollectors += onChainCollectors
          continue
        }
      } catch (err) {
        logger.error(`Error fetching on-chain collectors for track ${track.token_id}`, err)
      }
    }
    const collectorsRs = await db.execute({
      sql: `SELECT COUNT(DISTINCT user_address) as count FROM mints WHERE track_id = ?`,
      args: [track.token_id]
    })
    totalCollectors += Number(collectorsRs.rows[0]?.count || 0)
  }

  // Plays Over Time (Last 30 days)
  const overTimeRs = await db.execute({
    sql: `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM plays 
      WHERE track_id IN (${idsPlaceholder})
      AND timestamp >= DATE('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `,
    args: trackIds
  })
  const playsOverTime = overTimeRs.rows.map(row => ({
    date: row.date,
    count: Number(row.count)
  }))

  // Top Tracks
  const topTracksRs = await db.execute({
    sql: `
      SELECT 
        t.token_id,
        t.name,
        COUNT(p.id) as plays
      FROM tracks t
      JOIN plays p ON t.token_id = p.track_id
      WHERE t.token_id IN (${idsPlaceholder})
      GROUP BY t.token_id
      ORDER BY plays DESC
      LIMIT 5
    `,
    args: trackIds
  })
  const topTracks = topTracksRs.rows.map(row => ({
    tokenId: Number(row.token_id),
    name: row.name,
    plays: Number(row.plays)
  }))

  return {
    totalPlays,
    uniqueListeners,
    totalCollectors,
    playsOverTime,
    topTracks
  }
}

export async function getDrafts(userAddress: string): Promise<Pick<Draft, 'id' | 'name' | 'type' | 'updated_at'>[]> {
  const rs = await db.execute({
    sql: `SELECT id, name, type, updated_at FROM drafts WHERE user_address = ? ORDER BY updated_at DESC`,
    args: [String(userAddress).toLowerCase()]
  })
  return rs.rows.map(row => ({
    id: Number(row.id),
    name: row.name ? String(row.name) : undefined,
    type: String(row.type) as 'single' | 'album',
    updated_at: String(row.updated_at)
  }))
}

export async function getDraft(id: number, userAddress: string): Promise<Draft | null> {
  const rs = await db.execute({
    sql: `SELECT * FROM drafts WHERE id = ? AND user_address = ?`,
    args: [id, String(userAddress).toLowerCase()]
  })
  if (!rs.rows[0]) return null
  const row = rs.rows[0]
  return {
    id: Number(row.id),
    user_address: String(row.user_address),
    name: row.name ? String(row.name) : undefined,
    type: String(row.type) as 'single' | 'album',
    data_json: String(row.data_json),
    audio_hash: row.audio_hash ? String(row.audio_hash) : undefined,
    image_hash: row.image_hash ? String(row.image_hash) : undefined,
    audio_filename: row.audio_filename ? String(row.audio_filename) : undefined,
    image_filename: row.image_filename ? String(row.image_filename) : undefined,
    streaming_url: row.streaming_url ? String(row.streaming_url) : undefined,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }
}

export async function createDraft(userAddress: string, draft: DraftInput): Promise<number> {
  const rs = await db.execute({
    sql: `
      INSERT INTO drafts (user_address, name, type, data_json, audio_hash, image_hash, audio_filename, image_filename, streaming_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      String(userAddress).toLowerCase(),
      draft.name ?? null,
      draft.type,
      draft.data_json,
      draft.audio_hash ?? null,
      draft.image_hash ?? null,
      draft.audio_filename ?? null,
      draft.image_filename ?? null,
      draft.streaming_url ?? null
    ]
  })
  return Number(rs.lastInsertRowid)
}

export async function updateDraft(id: number, userAddress: string, draft: DraftInput): Promise<void> {
  await db.execute({
    sql: `
      UPDATE drafts
      SET name = ?, type = ?, data_json = ?, audio_hash = ?, image_hash = ?, audio_filename = ?, image_filename = ?, streaming_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_address = ?
    `,
    args: [
      draft.name ?? null,
      draft.type,
      draft.data_json,
      draft.audio_hash ?? null,
      draft.image_hash ?? null,
      draft.audio_filename ?? null,
      draft.image_filename ?? null,
      draft.streaming_url ?? null,
      id,
      String(userAddress).toLowerCase()
    ]
  })
}

export async function deleteDraft(id: number, userAddress: string): Promise<void> {
  await db.execute({
    sql: `DELETE FROM drafts WHERE id = ? AND user_address = ?`,
    args: [id, String(userAddress).toLowerCase()]
  })
}

export default db
