<script setup>
import BookingRecord from './BookingRecord.vue'
import WorkCard from './WorkCard.vue'
import UploadBar from './UploadBar.vue'

const props = defineProps(['bookings', 'works', 'categories', 'timeSlots', 'myTab'])
const emit = defineEmits(['tab-change', 'upload-work', 'back'])

function getCat(id) { return props.categories.find(c => c.id === id) || { icon:'📌', name:'未知' } }
function timeLabel(val) { const s = props.timeSlots.find(s => s.value === val); return s ? s.label : '—' }
</script>

<template>
  <div class="content-area">
    <button class="back-btn" @click="emit('back')">← 返回首页</button>
    <div class="section-title">我 的 传 承</div>
    <div class="my-tabs">
      <button class="my-tab" :class="{ active: myTab === 'bookings' }" @click="emit('tab-change', 'bookings')">📅 我的预约</button>
      <button class="my-tab" :class="{ active: myTab === 'works' }" @click="emit('tab-change', 'works')">🖼️ 作品展示</button>
    </div>

    <div v-if="myTab === 'bookings'">
      <div v-if="bookings.length === 0" class="empty-state"><div class="empty-icon">📅</div><p>暂无预约记录，去预约一节体验课吧</p></div>
      <BookingRecord v-for="b in bookings" :key="b.id"
        :booking="b" :category-icon="getCat(b.catId).icon"
        :category-name="getCat(b.catId).name" :time-label="timeLabel(b.time)"
      />
    </div>

    <div v-if="myTab === 'works'">
      <UploadBar :categories="categories" @upload="emit('upload-work', $event)" />
      <div v-if="works.length === 0" class="empty-state"><div class="empty-icon">🖼️</div><p>还没有上传作品，上完体验课后来展示你的成果吧</p></div>
      <div class="works-grid">
        <WorkCard v-for="w in works" :key="w.id" :work="w"
          :category-icon="getCat(w.catId).icon" :category-name="getCat(w.catId).name"
        />
      </div>
    </div>
  </div>
</template>
