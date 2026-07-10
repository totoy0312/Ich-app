<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../api.js'

const props = defineProps(['currentUser'])

const users = ref([])
const sentNotifications = ref([])
const notify = ref({ toUser: null, title: '', message: '' })
const sendSuccess = ref(false)

const canSend = computed(() => notify.value.title.trim() && notify.value.message.trim())

async function loadUsers() {
  try { users.value = await api.getAllUsers() } catch {}
}

async function loadSent() {
  if (!props.currentUser) return
  try { sentNotifications.value = await api.getSentNotifications(props.currentUser.username) } catch {}
}

async function send() {
  if (!canSend.value) return
  try {
    await api.sendNotification({
      fromAdmin: props.currentUser.username,
      toUser: notify.value.toUser,
      title: notify.value.title.trim(),
      message: notify.value.message.trim(),
    })
    notify.value = { toUser: null, title: '', message: '' }
    sendSuccess.value = true
    setTimeout(() => sendSuccess.value = false, 3000)
    await loadSent()
  } catch (e) { alert(e.message) }
}

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

onMounted(() => { loadUsers(); loadSent() })
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">消息通知</h2>
    <div class="notify-form">
      <div class="form-group">
        <label>发送给</label>
        <select v-model="notify.toUser">
          <option :value="null">所有用户（广播）</option>
          <option v-for="u in users" :key="u.username" :value="u.username">{{ u.username }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>标题</label>
        <input v-model="notify.title" placeholder="通知标题">
      </div>
      <div class="form-group">
        <label>内容</label>
        <textarea v-model="notify.message" rows="5" placeholder="通知内容..."></textarea>
      </div>
      <button class="btn-primary" :disabled="!canSend" @click="send">发送通知</button>
      <p v-if="sendSuccess" class="success-msg">✓ 发送成功</p>
    </div>

    <hr class="divider">

    <h3>发送历史</h3>
    <div v-if="sentNotifications.length === 0" class="empty-small">暂无发送记录</div>
    <div v-for="n in sentNotifications" :key="n.id" class="notify-history-item">
      <h4>{{ n.title }} <span class="time">{{ formatDate(n.created_at) }}</span></h4>
      <p>{{ n.message }}</p>
      <span class="badge">{{ n.to_user || '全站广播' }}</span>
    </div>
  </div>
</template>
