const express = require('express')
const cors = require('cors')
const db = require('../server/db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ====== 用户认证 ======

app.post('/api/register', (req, res) => {
  const { username, password, avatar } = req.body
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' })
  try {
    const user = db.createUser(username, password, avatar)
    res.json({ username: user.username, avatar: user.avatar })
  } catch (e) {
    if (e.message === 'UNIQUE') return res.status(400).json({ error: '用户名已存在' })
    res.status(500).json({ error: '注册失败' })
  }
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = db.findUser(username)
  if (!user) return res.status(400).json({ error: '用户不存在' })
  if (user.password !== password) return res.status(400).json({ error: '密码错误' })
  res.json({ username: user.username, avatar: user.avatar })
})

// ====== 预约 ======

app.get('/api/bookings', (req, res) => {
  const { username } = req.query
  res.json(db.getBookings(username || ''))
})

app.post('/api/bookings', (req, res) => {
  const { catId, catName, date, time, people, name, phone, username } = req.body
  if (!catId || !date || !time || !name || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'BK' + Date.now().toString(36).toUpperCase().slice(-8)
  db.createBooking({ id, username, cat_id: catId, cat_name: catName, date, time, people: people || 1, name, phone: phone || '', created_at: db.now() })
  res.json({ id })
})

app.delete('/api/bookings/:id', (req, res) => {
  db.deleteBooking(req.params.id)
  res.json({ success: true })
})

// ====== 作品 ======

app.get('/api/works', (req, res) => {
  const { username } = req.query
  res.json(db.getWorks(username || ''))
})

app.post('/api/works', (req, res) => {
  const { catId, image, desc, username } = req.body
  if (!catId || !desc || !username) return res.status(400).json({ error: '信息不完整' })
  const id = 'WK' + Date.now().toString(36).toUpperCase().slice(-8)
  db.createWork({ id, username, cat_id: catId, image: image || '', description: desc, created_at: db.now() })
  res.json({ id })
})

app.delete('/api/works/:id', (req, res) => {
  db.deleteWork(req.params.id)
  res.json({ success: true })
})

// ====== 非遗兴趣投票 ======

app.get('/api/interests', (req, res) => {
  res.json(db.getInterests())
})

app.post('/api/interests', (req, res) => {
  const { ichName, username } = req.body
  if (!ichName || !username) return res.status(400).json({ error: '信息不完整' })
  db.addInterest(ichName, username)
  res.json({ count: db.countInterest(ichName) })
})

module.exports = app
