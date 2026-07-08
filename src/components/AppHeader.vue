<script setup>
defineProps(['currentPage', 'currentUser'])
defineEmits(['navigate', 'logout'])
</script>

<template>
  <div class="header">
    <div class="logo">
      <div class="seal">承</div>
      <h1>非遗传承</h1>
    </div>
    <div class="nav-links">
      <a v-if="currentUser" :class="{ active: currentPage === 'home' }" @click="$emit('navigate', 'home')">首页</a>
      <a v-if="currentUser" :class="{ active: currentPage === 'booking' }" @click="$emit('navigate', 'booking')">预约体验</a>
      <a v-if="currentUser" :class="{ active: currentPage === 'my' }" @click="$emit('navigate', 'my')">我的</a>
    </div>
    <div v-if="currentUser" class="user-bar">
      <span class="user-avatar">{{ currentUser.avatar }}</span>
      <span class="user-name">{{ currentUser.username }}</span>
      <button class="logout-btn" @click="$emit('logout')">退出</button>
    </div>
  </div>
</template>
