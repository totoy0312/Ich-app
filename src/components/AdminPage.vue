<script setup>
import { ref } from 'vue'
import AdminDashboard from './admin/AdminDashboard.vue'
import UserManager from './admin/UserManager.vue'
import BookingManager from './admin/BookingManager.vue'
import WorkReview from './admin/WorkReview.vue'
import ContentManager from './admin/ContentManager.vue'
import NotificationCenter from './admin/NotificationCenter.vue'

defineProps(['currentUser'])
defineEmits(['back'])

const adminTab = ref('dashboard')
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">管理后台</div>
      <nav class="admin-nav">
        <button :class="{ active: adminTab === 'dashboard' }" @click="adminTab = 'dashboard'">📊 数据概览</button>
        <button :class="{ active: adminTab === 'users' }" @click="adminTab = 'users'">👥 用户管理</button>
        <button :class="{ active: adminTab === 'bookings' }" @click="adminTab = 'bookings'">📅 预约管理</button>
        <button :class="{ active: adminTab === 'works' }" @click="adminTab = 'works'">🖼️ 作品审核</button>
        <button :class="{ active: adminTab === 'content' }" @click="adminTab = 'content'">📝 内容管理</button>
        <button :class="{ active: adminTab === 'notifications' }" @click="adminTab = 'notifications'">🔔 消息通知</button>
      </nav>
      <button class="admin-back-btn" @click="$emit('back')">← 返回首页</button>
    </aside>
    <main class="admin-main">
      <AdminDashboard v-if="adminTab === 'dashboard'" />
      <UserManager v-else-if="adminTab === 'users'" />
      <BookingManager v-else-if="adminTab === 'bookings'" />
      <WorkReview v-else-if="adminTab === 'works'" />
      <ContentManager v-else-if="adminTab === 'content'" />
      <NotificationCenter v-else-if="adminTab === 'notifications'" :current-user="currentUser" />
    </main>
  </div>
</template>
