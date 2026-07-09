const BASE = ''  // 部署时改为后端地址，开发时 Vite 自动代理

async function request(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '请求失败')
  return data
}

export const api = {
  // 认证
  register: (username, password, avatar) =>
    request('POST', '/api/register', { username, password, avatar }),
  login: (username, password) =>
    request('POST', '/api/login', { username, password }),

  // 预约
  getBookings: (username) =>
    request('GET', `/api/bookings?username=${encodeURIComponent(username)}`),
  createBooking: (data) =>
    request('POST', '/api/bookings', data),
  deleteBooking: (id) =>
    request('DELETE', `/api/bookings/${id}`),

  // 作品
  getWorks: (username) =>
    request('GET', `/api/works?username=${encodeURIComponent(username)}`),
  createWork: (data) =>
    request('POST', '/api/works', data),
  deleteWork: (id) =>
    request('DELETE', `/api/works/${id}`),

  // 非遗兴趣
  getInterests: () =>
    request('GET', '/api/interests'),
  voteInterest: (ichName, username) =>
    request('POST', '/api/interests', { ichName, username }),
}
