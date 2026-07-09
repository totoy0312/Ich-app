const Database = require('better-sqlite3')
const path = require('path')
const isVercel = !!process.env.VERCEL
const dbPath = isVercel ? '/tmp/data.db' : path.join(__dirname, '..', 'data.db')

const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT DEFAULT '🐱',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

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
  );

  CREATE TABLE IF NOT EXISTS works (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    cat_id TEXT NOT NULL,
    image TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ich_name TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(ich_name, username)
  );
`)

module.exports = db
