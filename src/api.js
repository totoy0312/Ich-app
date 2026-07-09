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
    image: row.image, description: row.description, created_at: row.created_at }
}

export const api = {
  // 认证
  async register(username, password, avatar) {
    const { data, error } = await supabase
      .from('users')
      .insert({ username, password, avatar: avatar || '🐱' })
      .select('username, avatar')
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
      .select('username, avatar')
      .eq('username', username)
      .eq('password', password)
      .single()
    if (error || !data) throw new Error(error?.message || '用户名或密码错误')
    return data
  },

  // 预约
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

  // 作品
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

  // 非遗兴趣
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
}
