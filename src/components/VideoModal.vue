<script setup>
defineProps(['show', 'title'])
defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="video-modal-content">
      <button class="close-video" @click="$emit('close')">✕</button>
      <div class="video-placeholder">
        <span>🎬</span>
        <p style="font-size:20px;color:#ddd;letter-spacing:2px;">{{ title }}</p>
        <p>非遗文化纪录片</p>
        <p style="font-size:13px;color:#666;">时长约 15 分钟</p>
      </div>
    </div>
  </div>
</template>
