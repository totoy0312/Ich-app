const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

const isVercel = !!process.env.VERCEL
const dbPath = isVercel ? '/tmp/data.db' : path.join(__dirname, '..', 'data.db')

let db = null

async function getDb() {
  if (db) return db
  const SQL = await initSqlJs()
  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }
  db.run('PRAGMA foreign_keys = ON')
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '🐱',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      cat_id TEXT NOT NULL,
      cat_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      people INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      phone TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      cat_id TEXT NOT NULL,
      image TEXT,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ich_name TEXT NOT NULL,
      username TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      UNIQUE(ich_name, username)
    )
  `)
  saveDb()
  return db
}

function saveDb() {
  if (!db) return
  const data = db.export()
  const buf = Buffer.from(data)
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dbPath, buf)
}

// Wrap sql.js API to be synchronous-friendly
function run(sql, params = []) {
  db.run(sql, params)
  saveDb()
}

function get(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return row
  }
  stmt.free()
  return null
}

function all(sql, params = []) {
  const rows = []
  const stmt = db.prepare(sql)
  stmt.bind(params)
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

module.exports = { getDb, run, get, all }
