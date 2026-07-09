<script setup>
import { ref } from 'vue'

defineProps(['category'])
defineEmits(['select'])

const card = ref(null)
const style = ref({})

function onMove(e) {
  const rect = card.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2, cy = rect.height / 2
  const rx = ((y - cy) / cy) * -8
  const ry = ((x - cx) / cx) * 8
  style.value = { transform: `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)` }
}
function onLeave() {
  style.value = { transform: 'perspective(600px) rotateX(0) rotateY(0) scale(1)' }
}
</script>

<template>
  <div ref="card" class="cat-card cat-tilt" :style="style" @mousemove="onMove" @mouseleave="onLeave" @click="$emit('select', category)">
    <div class="cat-icon">{{ category.icon }}</div>
    <h3>{{ category.name }}</h3>
    <p>{{ category.desc }}</p>
    <span class="cat-tag">{{ category.articles.length }} 篇文章 · {{ category.videos.length }} 个视频</span>
  </div>
</template>
