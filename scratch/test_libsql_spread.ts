import { createClient } from '@libsql/client'

const db = createClient({
  url: 'file:backend/core-api/doba.db'
})

async function run() {
  const rs = await db.execute({
    sql: `
      SELECT *, 
             (SELECT COUNT(*) FROM plays p WHERE p.track_id = token_id) as play_count,
             (SELECT COUNT(*) FROM mints m WHERE m.track_id = token_id) as mint_count
      FROM tracks 
      WHERE token_id = ?
    `,
    args: [1784236463703]
  })

  const trackRow = rs.rows[0]
  console.log("trackRow type:", typeof trackRow)
  console.log("trackRow keys:", Object.keys(trackRow || {}))
  console.log("trackRow direct access (mint_count):", trackRow?.mint_count)
  console.log("trackRow spread:", { ...trackRow })
}

run().catch(console.error)
