<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'

const stats = ref({ totalUsers: 0, totalBookings: 0, totalWorks: 0, pendingWorks: 0, totalContent: 0 })

onMounted(async () => {
  try { stats.value = await api.getStats() } catch {}
})
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">数据概览</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">{{ stats.totalUsers }}</div>
        <div class="stat-label">注册用户</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">{{ stats.totalBookings }}</div>
        <div class="stat-label">预约总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-value">{{ stats.totalWorks }}</div>
        <div class="stat-label">作品总数</div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">{{ stats.pendingWorks }}</div>
        <div class="stat-label">待审核作品</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-value">{{ stats.totalContent }}</div>
        <div class="stat-label">内容条目</div>
      </div>
    </div>
  </div>
</template>
