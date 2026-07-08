<script setup>
defineProps(['category'])
defineEmits(['select'])
</script>

<template>
  <div class="cat-card" @click="$emit('select', category)">
    <div class="cat-icon">{{ category.icon }}</div>
    <h3>{{ category.name }}</h3>
    <p>{{ category.desc }}</p>
    <span class="cat-tag">{{ category.articles.length }} 篇文章 · {{ category.videos.length }} 个视频</span>
  </div>
</template>
