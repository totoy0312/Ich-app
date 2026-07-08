<script setup>
import { ref } from 'vue'
import { AVATARS } from '../data.js'

const props = defineProps(['users'])
const emit = defineEmits(['login'])

const tab = ref('login')

// 登录
const loginName = ref('')
const loginPass = ref('')
const loginError = ref('')

// 注册
const regName = ref('')
const regPass = ref('')
const regAvatar = ref('🐱')
const regError = ref('')

function doLogin() {
  const u = loginName.value.trim()
  const p = loginPass.value.trim()
  if (!u || !p) { loginError.value = '请填写用户名和密码'; return }
  if (!props.users[u]) { loginError.value = '用户不存在，请先注册'; return }
  if (props.users[u].password !== p) { loginError.value = '密码错误'; return }
  loginError.value = ''
  emit('login', { username: u, avatar: props.users[u].avatar })
}

function doRegister() {
  const u = regName.value.trim()
  const p = regPass.value.trim()
  if (!u || !p) { regError.value = '请填写用户名和密码'; return }
  if (p.length < 6) { regError.value = '密码至少6位'; return }
  if (props.users[u]) { regError.value = '用户名已存在'; return }
  props.users[u] = { password: p, avatar: regAvatar.value }
  regName.value = ''; regPass.value = ''; regAvatar.value = '🐱'
  tab.value = 'login'
  loginError.value = '注册成功，请登录~'
  setTimeout(() => { loginError.value = '' }, 2000)
}
</script>

<template>
  <div class="content-area" style="max-width:460px;margin:60px auto;">
    <div class="auth-card">
      <div class="auth-icon">🏮</div>
      <h2 class="auth-title">非遗传承</h2>
      <p class="auth-subtitle">登录以预约体验课程</p>

      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: tab === 'login' }" @click="tab = 'login'">登 录</button>
        <button class="auth-tab" :class="{ active: tab === 'register' }" @click="tab = 'register'">注 册</button>
      </div>

      <!-- 登录 -->
      <div v-if="tab === 'login'">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="loginName" placeholder="请输入用户名" @keyup.enter="doLogin">
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="loginPass" type="password" placeholder="请输入密码" @keyup.enter="doLogin">
        </div>
        <button class="submit-btn" @click="doLogin">登 录</button>
        <p class="auth-error">{{ loginError }}</p>
      </div>

      <!-- 注册 -->
      <div v-else>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="regName" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>密码（6位以上）</label>
          <input v-model="regPass" type="password" placeholder="请输入密码">
        </div>
        <label style="font-size:14px;color:var(--text-light);display:block;margin-bottom:6px;">选择头像</label>
        <div class="avatar-picker">
          <span v-for="a in AVATARS" :key="a" class="avatar-opt" :class="{ selected: regAvatar === a }" @click="regAvatar = a">{{ a }}</span>
        </div>
        <button class="submit-btn" @click="doRegister">注 册</button>
        <p class="auth-error">{{ regError }}</p>
      </div>
    </div>
  </div>
</template>
