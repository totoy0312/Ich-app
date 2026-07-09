const express = require('express')
const cors = require('cors')
const { getDb, run, get, all } = require('../server/db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 确保数据库初始化完成
app.use(async (req, res, next) => {
  try {
    await getDb()
    next()
  } catch (e) {
    res.status(500).json({ error: '数据库初始化失败' })
  }
})

// ====== 用户认证 ======

app.post('/api/register', (req, res) => {
  const { username, password, avatar } = req.body
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' })
  try {
    run('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)', [username, password, avatar || '🐱'])
    res.json({ username, avatar: avatar || '🐱' })
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) return res.status(400).json({ error: '用户名已存在' })
    res.status(500).json({ error: '注册失败' })
  }
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = get('SELECT * FROM users WHERE username = ?', [username])
  if (!user) return res.status(400).json({ error: '用户不存在' })
  if (user.password !== password) return res.status(400).json({ error: '密码错误' })
  res.json({ username: user.username, avatar: user.avatar })
})

// ====== 预约 ======

app.get('/api/bookings', (req, res) => {
  const { username } = req.query
  const rows = all('SELECT * FROM bookings WHERE username = ? ORDER BY created_at DESC', [username || ''])
  res.json(rows)
})

app.post('/api/bookings', (req, res) => {
  const { catId, catName, date, time, people, name, phone, username } = req.body
  if (!catId || !date || !time || !name || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'BK' + Date.now().toString(36).toUpperCase().slice(-8)
  run('INSERT INTO bookings (id, username, cat_id, cat_name, date, time, people, name, phone) VALUES (?,?,?,?,?,?,?,?,?)',
    [id, username, catId, catName, date, time, people || 1, name, phone || ''])
  res.json({ id })
})

app.delete('/api/bookings/:id', (req, res) => {
  run('DELETE FROM bookings WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

// ====== 作品 ======

app.get('/api/works', (req, res) => {
  const { username } = req.query
  const rows = all('SELECT * FROM works WHERE username = ? ORDER BY created_at DESC', [username || ''])
  res.json(rows)
})

app.post('/api/works', (req, res) => {
  const { catId, image, desc, username } = req.body
  if (!catId || !desc || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'WK' + Date.now().toString(36).toUpperCase().slice(-8)
  run('INSERT INTO works (id, username, cat_id, image, description) VALUES (?,?,?,?,?)',
    [id, username, catId, image || '', desc])
  res.json({ id })
})

app.delete('/api/works/:id', (req, res) => {
  run('DELETE FROM works WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

// ====== 非遗兴趣投票 ======

app.get('/api/interests', (req, res) => {
  const rows = all('SELECT ich_name, COUNT(*) as count FROM interests GROUP BY ich_name ORDER BY count DESC')
  const result = {}
  rows.forEach(r => { result[r.ich_name] = r.count })
  res.json(result)
})

app.post('/api/interests', (req, res) => {
  const { ichName, username } = req.body
  if (!ichName || !username) return res.status(400).json({ error: '信息不完整' })
  try {
    run('INSERT INTO interests (ich_name, username) VALUES (?, ?)', [ichName, username])
  } catch (e) { /* 忽略重复投票 */ }
  const count = get('SELECT COUNT(*) as count FROM interests WHERE ich_name = ?', [ichName])
  res.json({ count: count ? count.count : 0 })
})

module.exports = app
