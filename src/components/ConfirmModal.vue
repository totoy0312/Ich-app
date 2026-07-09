<script setup>
import { computed } from 'vue'

const props = defineProps(['show', 'message'])
defineEmits(['close'])

const confetti = computed(() => {
  if (!props.show) return []
  return Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    hue: Math.floor(Math.random() * 360),
    drift: (Math.random() - 0.5) * 200,
  }))
})
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <span v-for="(c, i) in confetti" :key="i" class="confetti" :style="{
        left: c.x + '%',
        animationDelay: c.delay + 's',
        '--hue': c.hue,
        '--drift': c.drift + 'px',
      }"></span>
      <div class="modal-icon">✅</div>
      <h2>预约成功</h2>
      <p>{{ message }}</p>
      <button class="modal-btn" @click="$emit('close')">确 定</button>
    </div>
  </div>
</template>
