<script setup>
import { ref, computed, watch } from 'vue'
import { CATEGORIES, TIME_SLOTS, VIDEO_BGS, LS } from './data.js'
import AppHeader from './components/AppHeader.vue'
import HeroBanner from './components/HeroBanner.vue'
import CategoryCard from './components/CategoryCard.vue'
import DetailPage from './components/DetailPage.vue'
import BookingPage from './components/BookingPage.vue'
import MyPage from './components/MyPage.vue'
import AuthPage from './components/AuthPage.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import VideoModal from './components/VideoModal.vue'

// ---- 用户认证 ----
const users = ref(LS.get('users', {}))
const currentUser = ref(LS.get('currentUser', null))

// ---- 页面状态 ----
const page = ref('home')
const detailTab = ref('articles')
const myTab = ref('bookings')
const currentCatId = ref('papercut')

// ---- 业务数据 ----
const bookings = ref(LS.get('bookings', []))
const works = ref(LS.get('works', []))

// ---- 弹窗 ----
const showModal = ref(false)
const modalMsg = ref('')
const showVideo = ref(false)
const videoTitle = ref('')

// ---- 计算属性 ----
const currentCat = computed(() => CATEGORIES.find(c => c.id === currentCatId.value) || CATEGORIES[0])
const myBookings = computed(() =>
  bookings.value.filter(b => b.username === currentUser.value?.username).reverse()
)
const myWorks = computed(() =>
  works.value.filter(w => w.username === currentUser.value?.username).reverse()
)

// ---- 持久化 ----
watch(users, v => LS.set('users', v), { deep: true })
watch(currentUser, v => LS.set('currentUser', v), { deep: true })
watch(bookings, v => LS.set('bookings', v), { deep: true })
watch(works, v => LS.set('works', v), { deep: true })

// ---- 导航 ----
function goHome() { page.value = 'home'; detailTab.value = 'articles' }
function openCategory(cat) { currentCatId.value = cat.id; page.value = 'detail'; detailTab.value = 'articles' }
function openVideo(v) { videoTitle.value = v.title; showVideo.value = true }

// ---- 认证 ----
function onLogin(user) { currentUser.value = user; page.value = 'home' }
function logout() { currentUser.value = null; page.value = 'auth' }

// ---- 预约 ----
function submitBooking(data) {
  bookings.value.push({
    id: 'BK' + Date.now().toString(36).toUpperCase().slice(-8),
    ...data, username: currentUser.value.username,
    createdAt: new Date().toLocaleString(),
  })
  const tl = TIME_SLOTS.find(s => s.value === data.time)
  modalMsg.value = `已预约【${data.catName}】体验课，${data.date} ${tl ? tl.label : ''}，我们不见不散！`
  showModal.value = true
}

// ---- 作品 ----
function submitWork(data) {
  const colors = ['#f5e6d3','#e8d5c8','#dce5e0','#e0dce5','#f0e5d8','#fdf0e0']
  works.value.push({
    id: 'WK' + Date.now().toString(36).toUpperCase().slice(-8),
    ...data, username: currentUser.value.username,
    bg: colors[Math.floor(Math.random() * colors.length)],
    time: new Date().toLocaleString(),
  })
}

// ---- 初始化 ----
if (!currentUser.value) page.value = 'auth'
</script>

<template>
  <div class="app">
    <AppHeader
      :current-page="page" :current-user="currentUser"
      @navigate="page = $event" @logout="logout"
    />

    <!-- 未登录 → 认证页 -->
    <AuthPage
      v-if="page === 'auth'"
      :users="users" @login="onLogin"
    />

    <template v-if="page === 'home'">
      <HeroBanner />
      <div class="content-area">
        <div class="section-title">探 寻 非 遗</div>
        <div class="cat-grid">
          <CategoryCard v-for="cat in CATEGORIES" :key="cat.id" :category="cat" @select="openCategory" />
        </div>
      </div>
    </template>

    <DetailPage
      v-if="page === 'detail'"
      :category="currentCat" :detail-tab="detailTab" :video-bgs="VIDEO_BGS"
      @back="goHome" @tab-change="detailTab = $event" @play-video="openVideo"
    />

    <BookingPage
      v-if="page === 'booking'"
      :categories="CATEGORIES" :time-slots="TIME_SLOTS" :bookings="bookings"
      @submit="submitBooking" @back="goHome"
    />

    <MyPage
      v-if="page === 'my'"
      :bookings="myBookings" :works="myWorks"
      :categories="CATEGORIES" :time-slots="TIME_SLOTS" :my-tab="myTab"
      @tab-change="myTab = $event" @upload-work="submitWork" @back="goHome"
    />

    <ConfirmModal :show="showModal" :message="modalMsg" @close="showModal = false" />
    <VideoModal :show="showVideo" :title="videoTitle" @close="showVideo = false" />

    <div class="footer"><p>非遗传承 · 指尖上的中国 © 2026</p></div>
  </div>
</template>
