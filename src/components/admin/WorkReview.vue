<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'

const works = ref([])
const filterStatus = ref('pending')

function statusLabel(s) {
  return s === 'approved' ? '已通过' : s === 'rejected' ? '已拒绝' : '待审核'
}

async function loadWorks(s) {
  filterStatus.value = s
  try { works.value = await api.getAllWorks(s) } catch {}
}

async function approve(id) {
  await api.updateWorkStatus(id, 'approved')
  loadWorks(filterStatus.value)
}

async function reject(id) {
  await api.updateWorkStatus(id, 'rejected')
  loadWorks(filterStatus.value)
}

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

onMounted(() => loadWorks('pending'))
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">作品审核</h2>
    <div class="tab-bar">
      <button :class="{ active: filterStatus === 'pending' }" @click="loadWorks('pending')">待审核</button>
      <button :class="{ active: filterStatus === 'approved' }" @click="loadWorks('approved')">已通过</button>
      <button :class="{ active: filterStatus === 'rejected' }" @click="loadWorks('rejected')">已拒绝</button>
    </div>
    <div v-if="works.length === 0" class="empty-small">暂无作品</div>
    <div class="review-list">
      <div v-for="w in works" :key="w.id" class="review-card">
        <div class="review-img"><img v-if="w.image" :src="w.image"><span v-else class="review-emoji">🖼️</span></div>
        <div class="review-info">
          <p><strong>{{ w.username }}</strong> · {{ w.description }}</p>
          <p class="review-meta">{{ formatDate(w.created_at) }}</p>
          <span class="badge" :class="'status-' + w.status">{{ statusLabel(w.status) }}</span>
        </div>
        <div v-if="w.status === 'pending'" class="review-actions">
          <button class="btn-approve" @click="approve(w.id)">✓ 通过</button>
          <button class="btn-reject" @click="reject(w.id)">✕ 拒绝</button>
        </div>
      </div>
    </div>
  </div>
</template>
