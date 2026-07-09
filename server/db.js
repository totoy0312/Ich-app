const fs = require('fs')
const path = require('path')

const isVercel = !!process.env.VERCEL
const dbPath = isVercel ? '/tmp/data.json' : path.join(__dirname, '..', 'data.json')

let data = null

function load() {
  if (data) return data
  try {
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
      return data
    }
  } catch {}
  data = { users: [], bookings: [], works: [], interests: [], userSeq: 0 }
  save()
  return data
}

function save() {
  if (!data) return
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

module.exports = {
  load,
  now,

  // users
  findUser(username) {
    return load().users.find(u => u.username === username) || null
  },
  createUser(username, password, avatar) {
    const d = load()
    if (d.users.find(u => u.username === username)) throw new Error('UNIQUE')
    const user = { id: ++d.userSeq, username, password, avatar: avatar || '🐱', created_at: now() }
    d.users.push(user)
    save()
    return user
  },

  // bookings
  getBookings(username) {
    return load().bookings.filter(b => b.username === username).reverse()
  },
  createBooking(booking) {
    load().bookings.push(booking)
    save()
  },
  deleteBooking(id) {
    const d = load()
    d.bookings = d.bookings.filter(b => b.id !== id)
    save()
  },

  // works
  getWorks(username) {
    return load().works.filter(w => w.username === username).reverse()
  },
  createWork(work) {
    load().works.push(work)
    save()
  },
  deleteWork(id) {
    const d = load()
    d.works = d.works.filter(w => w.id !== id)
    save()
  },

  // interests
  getInterests() {
    const d = load()
    const result = {}
    d.interests.forEach(i => {
      result[i.ich_name] = (result[i.ich_name] || 0) + 1
    })
    return result
  },
  addInterest(ichName, username) {
    const d = load()
    if (d.interests.find(i => i.ich_name === ichName && i.username === username)) return
    d.interests.push({ ich_name: ichName, username, created_at: now() })
    save()
  },
  countInterest(ichName) {
    return load().interests.filter(i => i.ich_name === ichName).length
  }
}
