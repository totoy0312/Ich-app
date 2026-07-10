<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'

const users = ref([])
const expandedUser = ref(null)
const userBookings = ref([])
const userWorks = ref([])

async function loadUsers() {
  try { users.value = await api.getAllUsers() } catch {}
}

async function toggleExpand(username) {
  if (expandedUser.value === username) { expandedUser.value = null; return }
  expandedUser.value = username
  try {
    const [b, w] = await Promise.all([api.getUserBookings(username), api.getUserWorks(username)])
    userBookings.value = b; userWorks.value = w
  } catch {}
}

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

onMounted(loadUsers)
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">用户管理</h2>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>头像</th><th>用户名</th><th>角色</th><th>预约</th><th>作品</th><th>注册时间</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.username">
            <td><span class="user-avatar-lg">{{ u.avatar }}</span></td>
            <td>{{ u.username }}</td>
            <td><span :class="u.is_admin ? 'badge-admin' : 'badge-user'">{{ u.is_admin ? '管理员' : '用户' }}</span></td>
            <td>{{ u.bookingCount }}</td>
            <td>{{ u.workCount }}</td>
            <td>{{ formatDate(u.created_at) }}</td>
            <td><button class="btn-sm" @click="toggleExpand(u.username)">{{ expandedUser === u.username ? '收起' : '详情' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="expandedUser" class="expand-panel">
      <h3>{{ expandedUser }} 的记录</h3>
      <h4>📅 预约记录 ({{ userBookings.length }})</h4>
      <div v-if="userBookings.length === 0" class="empty-small">暂无预约</div>
      <div v-for="b in userBookings" :key="b.id" class="mini-row">
        <span>{{ b.catName }}</span> <span>{{ b.date }} {{ b.time }}</span> <span>{{ b.people }}人</span> <span>{{ b.name }}</span>
      </div>
      <h4>🖼️ 作品 ({{ userWorks.length }})</h4>
      <div v-if="userWorks.length === 0" class="empty-small">暂无作品</div>
      <div v-for="w in userWorks" :key="w.id" class="mini-row">
        <span>🖼️</span> <span>{{ w.description }}</span> <span class="badge" :class="'status-' + w.status">{{ w.status || '无状态' }}</span>
      </div>
    </div>
  </div>
</template>
