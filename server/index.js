const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ====== 用户认证 ======

app.post('/api/register', (req, res) => {
  const { username, password, avatar } = req.body
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' })
  try {
    db.prepare('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)').run(username, password, avatar || '🐱')
    res.json({ username, avatar: avatar || '🐱' })
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ error: '用户名已存在' })
    res.status(500).json({ error: '注册失败' })
  }
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) return res.status(400).json({ error: '用户不存在' })
  if (user.password !== password) return res.status(400).json({ error: '密码错误' })
  res.json({ username: user.username, avatar: user.avatar })
})

// ====== 预约 ======

app.get('/api/bookings', (req, res) => {
  const { username } = req.query
  const rows = db.prepare('SELECT * FROM bookings WHERE username = ? ORDER BY created_at DESC').all(username || '')
  res.json(rows)
})

app.get('/api/bookings/all', (req, res) => {
  const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
  res.json(rows)
})

app.post('/api/bookings', (req, res) => {
  const { catId, catName, date, time, people, name, phone, username } = req.body
  if (!catId || !date || !time || !name || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'BK' + Date.now().toString(36).toUpperCase().slice(-8)
  db.prepare('INSERT INTO bookings (id, username, cat_id, cat_name, date, time, people, name, phone) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, username, catId, catName, date, time, people || 1, name, phone || '')
  res.json({ id })
})

app.delete('/api/bookings/:id', (req, res) => {
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ====== 作品 ======

app.get('/api/works', (req, res) => {
  const { username } = req.query
  const rows = db.prepare('SELECT * FROM works WHERE username = ? ORDER BY created_at DESC').all(username || '')
  res.json(rows)
})

app.post('/api/works', (req, res) => {
  const { catId, image, desc, username } = req.body
  if (!catId || !desc || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'WK' + Date.now().toString(36).toUpperCase().slice(-8)
  db.prepare('INSERT INTO works (id, username, cat_id, image, description) VALUES (?,?,?,?,?)')
    .run(id, username, catId, image || '', desc)
  res.json({ id })
})

app.delete('/api/works/:id', (req, res) => {
  db.prepare('DELETE FROM works WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ====== 非遗兴趣投票 ======

app.get('/api/interests', (req, res) => {
  const rows = db.prepare('SELECT ich_name, COUNT(*) as count FROM interests GROUP BY ich_name ORDER BY count DESC').all()
  const result = {}
  rows.forEach(r => { result[r.ich_name] = r.count })
  res.json(result)
})

app.post('/api/interests', (req, res) => {
  const { ichName, username } = req.body
  if (!ichName || !username) return res.status(400).json({ error: '信息不完整' })
  try {
    db.prepare('INSERT INTO interests (ich_name, username) VALUES (?, ?)').run(ichName, username)
  } catch (e) {
    // 忽略重复投票
  }
  const count = db.prepare('SELECT COUNT(*) as count FROM interests WHERE ich_name = ?').get(ichName)
  res.json({ count: count.count })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
