<script setup>
defineProps(['work', 'categoryIcon', 'categoryName'])
defineEmits(['delete'])
</script>

<template>
  <div class="work-card">
    <div class="work-img" :style="{ background: work.bg || '#f5f0e8' }">
      <img v-if="work.image" :src="work.image" class="work-image">
      <span v-else class="work-emoji">{{ categoryIcon }}</span>
      <button class="work-delete" @click.stop="$emit('delete', work.id)" title="删除作品">✕</button>
    </div>
    <div class="work-info">
      <div class="work-cat">{{ categoryName }}</div>
      <p>{{ work.desc }}</p>
      <div class="work-time">{{ work.time }}</div>
    </div>
  </div>
</template>
