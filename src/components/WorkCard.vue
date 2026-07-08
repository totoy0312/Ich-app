<script setup>
defineProps(['work', 'categoryIcon', 'categoryName'])
</script>

<template>
  <div class="work-card">
    <div class="work-img" :style="{ background: work.bg || '#f5f0e8' }">{{ categoryIcon }}</div>
    <div class="work-info">
      <div class="work-cat">{{ categoryName }}</div>
      <p>{{ work.desc }}</p>
      <div class="work-time">{{ work.time }}</div>
    </div>
  </div>
</template>
