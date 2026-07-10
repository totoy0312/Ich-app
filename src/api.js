import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vgvrjvmekxcsftnthxwf.supabase.co',
  'sb_publishable_f3pNVVeRA9woQxdn0sABXQ_lNSeUk7F'
)

function mapBooking(row) {
  return { id: row.id, username: row.username, catId: row.cat_id, catName: row.cat_name,
    date: row.date, time: row.time, people: row.people, name: row.name,
    phone: row.phone, created_at: row.created_at }
}

function mapWork(row) {
  return { id: row.id, username: row.username, catId: row.cat_id,
    image: row.image, description: row.description, status: row.status, created_at: row.created_at }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('ich_user') || 'null')
}

function requireAdmin() {
  const user = getCurrentUser()
  if (!user || !user.is_admin) throw new Error('需要管理员权限。当前用户: ' + JSON.stringify(user))
  return user
}

export const api = {
  // ====== 认证 ======
  async register(username, password, avatar) {
    const { data, error } = await supabase
      .from('users')
      .insert({ username, password, avatar: avatar || '🐱' })
      .select('username, avatar, is_admin')
      .single()
    if (error) {
      if (error.code === '23505') throw new Error('用户名已存在')
      throw new Error('注册失败')
    }
    return data
  },

  async login(username, password) {
    const { data, error } = await supabase
      .from('users')
      .select('username, avatar, is_admin')
      .eq('username', username)
      .eq('password', password)
      .single()
    if (error || !data) throw new Error(error?.message || '用户名或密码错误')
    return data
  },

  // ====== 预约 ======
  async getBookings(username) {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
    return (data || []).map(mapBooking)
  },

  async createBooking(b) {
    const row = { id: b.id, username: b.username, cat_id: b.catId, cat_name: b.catName,
      date: b.date, time: b.time, people: b.people, name: b.name, phone: b.phone }
    const { data, error } = await supabase.from('bookings').insert(row).select('id').single()
    if (error) throw new Error('预约失败')
    return data
  },

  async deleteBooking(id) {
    await supabase.from('bookings').delete().eq('id', id)
  },

  // ====== 作品 ======
  async getWorks(username) {
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
    return (data || []).map(mapWork)
  },

  async createWork(w) {
    const row = { id: w.id, username: w.username, cat_id: w.catId,
      image: w.image, description: w.desc }
    const { data, error } = await supabase.from('works').insert(row).select('id').single()
    if (error) throw new Error('上传失败')
    return data
  },

  async deleteWork(id) {
    await supabase.from('works').delete().eq('id', id)
  },

  // ====== 非遗兴趣 ======
  async getInterests() {
    const { data } = await supabase.rpc('get_interests')
    if (data) {
      const result = {}
      data.forEach(r => { result[r.ich_name] = Number(r.count) })
      return result
    }
    return {}
  },

  async voteInterest(ichName, username) {
    await supabase.from('interests').insert({ ich_name: ichName, username })
  },

  // ====== 管理员：数据概览 ======
  async getStats() {
    requireAdmin()
    const [uRes, bRes, wRes, cRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('works').select('id, status'),
      supabase.from('ich_content').select('id', { count: 'exact', head: true }),
    ])
    const works = wRes.data || []
    return {
      totalUsers: uRes.count || 0,
      totalBookings: bRes.count || 0,
      totalWorks: works.length,
      pendingWorks: works.filter(w => w.status === 'pending').length,
      totalContent: cRes.count || 0,
    }
  },

  // ====== 管理员：用户管理 ======
  async getAllUsers() {
    requireAdmin()
    const { data: users } = await supabase.from('users')
      .select('username, avatar, is_admin, created_at')
      .order('created_at', { ascending: false })
    const { data: bookings } = await supabase.from('bookings').select('username')
    const { data: works } = await supabase.from('works').select('username')
    const bc = {}, wc = {}
    bookings?.forEach(b => { bc[b.username] = (bc[b.username] || 0) + 1 })
    works?.forEach(w => { wc[w.username] = (wc[w.username] || 0) + 1 })
    return (users || []).map(u => ({ ...u, bookingCount: bc[u.username] || 0, workCount: wc[u.username] || 0 }))
  },

  async getUserBookings(username) {
    requireAdmin()
    const { data } = await supabase.from('bookings').select('*')
      .eq('username', username).order('created_at', { ascending: false })
    return (data || []).map(mapBooking)
  },

  async getUserWorks(username) {
    requireAdmin()
    const { data } = await supabase.from('works').select('*')
      .eq('username', username).order('created_at', { ascending: false })
    return (data || []).map(mapWork)
  },

  // ====== 管理员：预约管理 ======
  async getAllBookings() {
    requireAdmin()
    const { data } = await supabase.from('bookings').select('*')
      .order('created_at', { ascending: false })
    return (data || []).map(mapBooking)
  },

  // ====== 管理员：作品审核 ======
  async getAllWorks(status) {
    requireAdmin()
    let query = supabase.from('works').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    const { data } = await query
    return (data || []).map(mapWork)
  },

  async updateWorkStatus(workId, status) {
    requireAdmin()
    const { error } = await supabase.from('works').update({ status }).eq('id', workId)
    if (error) throw new Error('更新失败')
  },

  // ====== 管理员：内容管理 ======
  async getContents(catId) {
    const { data } = await supabase.from('ich_content').select('*')
      .eq('cat_id', catId).order('created_at', { ascending: false })
    return data || []
  },

  async getAllContents() {
    requireAdmin()
    const { data } = await supabase.from('ich_content').select('*')
      .order('created_at', { ascending: false })
    return data || []
  },

  async createContent(item) {
    requireAdmin()
    const { error } = await supabase.from('ich_content').insert({
      cat_id: item.catId, type: item.type, title: item.title,
      content: item.content, description: item.description || '',
    })
    if (error) throw new Error('创建失败: ' + error.message)
  },

  async updateContent(id, updates) {
    requireAdmin()
    const { error } = await supabase.from('ich_content').update({
      ...updates, updated_at: new Date().toISOString()
    }).eq('id', id)
    if (error) throw new Error('更新失败: ' + error.message)
  },

  async deleteContent(id) {
    requireAdmin()
    await supabase.from('ich_content').delete().eq('id', id)
  },

  // ====== 通知 ======
  async sendNotification(data) {
    requireAdmin()
    const { error } = await supabase.from('notifications').insert({
      from_admin: data.fromAdmin,
      to_user: data.toUser || null,
      title: data.title,
      message: data.message,
    })
    if (error) throw new Error('发送失败')
  },

  async getNotifications(username) {
    const { data } = await supabase.from('notifications').select('*')
      .or(`to_user.eq.${username},to_user.is.null`)
      .order('created_at', { ascending: false })
      .limit(50)
    return data || []
  },

  async getSentNotifications(fromAdmin) {
    requireAdmin()
    const { data } = await supabase.from('notifications').select('*')
      .eq('from_admin', fromAdmin)
      .order('created_at', { ascending: false })
      .limit(100)
    return data || []
  },

  async markNotificationRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  },

  async getUnreadCount(username) {
    const { count } = await supabase.from('notifications')
      .select('id', { count: 'exact', head: true })
      .or(`to_user.eq.${username},to_user.is.null`)
      .eq('is_read', false)
    return count || 0
  },
}
