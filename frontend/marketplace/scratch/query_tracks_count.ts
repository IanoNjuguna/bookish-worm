import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

const candidates = [
  'doba.db',
  path.join('backend', 'doba.db'),
]

function queryDb(dbPath: string) {
  try {
    const db = new DatabaseSync(dbPath, { open: true })

    const tableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tracks'")
      .get() as { name?: string } | undefined

    if (!tableExists?.name) {
      console.log(`DB: ${dbPath}`)
      console.log('  tracks table: missing')
      console.log('')
      db.close()
      return
    }

    const countRow = db.prepare('SELECT COUNT(*) AS count FROM tracks').get() as { count?: number }
    const sample = db
      .prepare('SELECT token_id, name, artist FROM tracks ORDER BY token_id DESC LIMIT 5')
      .all() as Array<{ token_id: number; name: string; artist: string }>

    console.log(`DB: ${dbPath}`)
    console.log(`  tracks count: ${countRow?.count ?? 0}`)

    if (!sample.length) {
      console.log('  sample: none')
    } else {
      console.log('  sample:')
      for (const row of sample) {
        console.log(`    - ${row.token_id}: ${row.name} (${row.artist})`)
      }
    }

    console.log('')
    db.close()
  } catch (error: any) {
    console.log(`DB: ${dbPath}`)
    console.log(`  error: ${error?.message || String(error)}`)
    console.log('')
  }
}

for (const dbPath of candidates) {
  queryDb(dbPath)
}
