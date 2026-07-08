<script setup>
defineProps(['booking', 'categoryIcon', 'categoryName', 'timeLabel'])
</script>

<template>
  <div class="booking-card">
    <div class="bc-left">
      <span class="bc-icon">{{ categoryIcon }}</span>
      <div class="bc-info">
        <h4>{{ categoryName }} · 体验课</h4>
        <p>{{ booking.date }} · {{ timeLabel }} · {{ booking.people }}人 · {{ booking.name }}</p>
      </div>
    </div>
    <span class="bc-status">已确认</span>
  </div>
</template>
