<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'

const bookings = ref([])

async function load() {
  try { bookings.value = await api.getAllBookings() } catch {}
}

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

onMounted(load)
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">预约管理</h2>
    <div v-if="bookings.length === 0" class="empty-small">暂无预约</div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>ID</th><th>用户</th><th>项目</th><th>日期</th><th>时间</th><th>人数</th><th>姓名</th><th>电话</th></tr></thead>
        <tbody>
          <tr v-for="b in bookings" :key="b.id">
            <td>{{ b.id }}</td>
            <td>{{ b.username }}</td>
            <td>{{ b.catName }}</td>
            <td>{{ b.date }}</td>
            <td>{{ b.time }}</td>
            <td>{{ b.people }}</td>
            <td>{{ b.name }}</td>
            <td>{{ b.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
