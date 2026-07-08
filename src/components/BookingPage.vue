<script setup>
import { ref, computed } from 'vue'
import BookingForm from './BookingForm.vue'
import BookingPreview from './BookingPreview.vue'

const props = defineProps(['categories', 'timeSlots', 'bookings'])
const emit = defineEmits(['submit', 'back'])

const formData = ref(null)

const previewTimeLabel = computed(() => {
  if (!formData.value) return '—'
  const s = props.timeSlots.find(s => s.value === formData.value.time)
  return s ? s.label : '—'
})

function onFormSubmit(data) {
  formData.value = data
  emit('submit', data)
}
</script>

<template>
  <div class="content-area">
    <button class="back-btn" @click="emit('back')">← 返回首页</button>
    <div class="section-title">预 约 体 验 课</div>
    <div class="booking-layout">
      <BookingForm :categories="categories" :time-slots="timeSlots" :bookings="bookings" @submit="onFormSubmit" />
      <BookingPreview
        :cat-name="formData ? formData.catName : ''"
        :date="formData ? formData.date : ''"
        :time-label="previewTimeLabel"
        :people="formData ? formData.people : 1"
        :name="formData ? formData.name : ''"
      />
    </div>
  </div>
</template>
