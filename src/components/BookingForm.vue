<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['categories', 'timeSlots', 'bookings'])
const emit = defineEmits(['submit'])

const catId = ref('')
const date = ref('')
const time = ref('')
const people = ref(1)
const name = ref('')
const phone = ref('')

const todayStr = computed(() => new Date().toISOString().split('T')[0])
const canSubmit = computed(() => catId.value && date.value && time.value && name.value.trim())

function isSlotBooked(slotVal) {
  if (!date.value || !catId.value) return false
  return props.bookings.some(b => b.catId === catId.value && b.date === date.value && b.time === slotVal)
}

function doSubmit() {
  const cat = props.categories.find(c => c.id === catId.value)
  emit('submit', {
    catId: catId.value, date: date.value, time: time.value,
    people: people.value, name: name.value.trim(), phone: phone.value.trim(),
    catName: cat ? cat.name : '',
  })
  catId.value = ''; date.value = ''; time.value = ''; people.value = 1; name.value = ''; phone.value = ''
}
</script>

<template>
  <div class="book-form">
    <h3>📅 填写预约信息</h3>
    <div class="form-group">
      <label>选择非遗项目</label>
      <select v-model="catId">
        <option value="">请选择</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>预约日期</label><input type="date" v-model="date" :min="todayStr"></div>
      <div class="form-group">
        <label>体验人数</label>
        <select v-model="people"><option v-for="n in 10" :key="n" :value="n">{{ n }} 人</option></select>
      </div>
    </div>
    <div class="form-group">
      <label>选择时段</label>
      <div class="time-slots">
        <button v-for="slot in timeSlots" :key="slot.value"
          class="slot-btn" :class="{ active: time === slot.value }"
          :disabled="isSlotBooked(slot.value)" @click="time = slot.value"
        >{{ slot.label }}</button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>姓名</label><input v-model="name" placeholder="请输入姓名"></div>
      <div class="form-group"><label>手机号</label><input v-model="phone" placeholder="请输入手机号"></div>
    </div>
    <button class="submit-btn" :disabled="!canSubmit" @click="doSubmit">确认预约</button>
  </div>
</template>
