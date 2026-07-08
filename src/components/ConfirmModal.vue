<script setup>
defineProps(['show', 'message'])
defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-icon">✅</div>
      <h2>预约成功</h2>
      <p>{{ message }}</p>
      <button class="modal-btn" @click="$emit('close')">确 定</button>
    </div>
  </div>
</template>
