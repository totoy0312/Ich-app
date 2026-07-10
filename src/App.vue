<script setup>
import { ref, computed, watch } from 'vue'
import { CATEGORIES, TIME_SLOTS, VIDEO_BGS } from './data.js'
import { api } from './api.js'
import AppHeader from './components/AppHeader.vue'
import HeroBanner from './components/HeroBanner.vue'
import CategoryCard from './components/CategoryCard.vue'
import DetailPage from './components/DetailPage.vue'
import BookingPage from './components/BookingPage.vue'
import MyPage from './components/MyPage.vue'
import AuthPage from './components/AuthPage.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import VideoModal from './components/VideoModal.vue'
import ChinaMap from './components/ChinaMap.vue'
import AdminPage from './components/AdminPage.vue'
import ParticleBg from './components/ParticleBg.vue'

// ---- 用户认证 ----
const currentUser = ref(JSON.parse(localStorage.getItem('ich_user') || 'null'))
watch(currentUser, v => localStorage.setItem('ich_user', JSON.stringify(v)), { deep: true })

// ---- 页面状态 ----
const page = ref('home')
const detailTab = ref('articles')
const myTab = ref('bookings')
const currentCatId = ref('papercut')

// ---- 业务数据 ----
const bookings = ref([])
const works = ref([])
const loading = ref(false)

// ---- 弹窗 ----
const showModal = ref(false)
const modalMsg = ref('')
const showVideo = ref(false)
const videoTitle = ref('')

// ---- 计算属性 ----
const currentCat = computed(() => CATEGORIES.find(c => c.id === currentCatId.value) || CATEGORIES[0])
const myBookings = computed(() => bookings.value.filter(b => b.username === currentUser.value?.username).reverse())
const myWorks = computed(() => works.value.filter(w => w.username === currentUser.value?.username).reverse())
const isAdmin = computed(() => currentUser.value?.is_admin === true)

// ---- 数据加载 ----
async function loadBookings() {
  if (!currentUser.value) return
  try { bookings.value = await api.getBookings(currentUser.value.username) } catch {}
}
async function loadWorks() {
  if (!currentUser.value) return
  try { works.value = await api.getWorks(currentUser.value.username) } catch {}
}

// ---- 通知 ----
const notifications = ref([])
const unreadCount = ref(0)

async function loadNotifications() {
  if (!currentUser.value) return
  try {
    notifications.value = await api.getNotifications(currentUser.value.username)
    unreadCount.value = await api.getUnreadCount(currentUser.value.username)
  } catch {}
}

async function markRead(id) {
  await api.markNotificationRead(id)
  await loadNotifications()
}

// ---- 导航 ----
function goHome() { page.value = 'home'; detailTab.value = 'articles' }
function openCategory(cat) { currentCatId.value = cat.id; page.value = 'detail'; detailTab.value = 'articles' }
function openVideo(v) { videoTitle.value = v.title; showVideo.value = true }

// ---- 认证 ----
async function onLogin(user) {
  currentUser.value = user
  page.value = 'home'
  await Promise.all([loadBookings(), loadWorks(), loadNotifications()])
}
function logout() { currentUser.value = null; page.value = 'auth' }

// ---- 预约 ----
async function submitBooking(data) {
  try {
    const bkId = 'BK' + Date.now().toString(36).toUpperCase().slice(-8)
   await api.createBooking({ id: bkId, ...data, username: currentUser.value.username })
    await loadBookings()
    const tl = TIME_SLOTS.find(s => s.value === data.time)
    modalMsg.value = `已预约【${data.catName}】体验课，${data.date} ${tl ? tl.label : ''}，我们不见不散！`
    showModal.value = true
  } catch (e) { alert(e.message) }
}

// ---- 作品 ----
async function deleteWork(workId) {
  try { await api.deleteWork(workId); await loadWorks() } catch {}
}
async function submitWork(data) {
  try {
    const wkId = 'WK' + Date.now().toString(36).toUpperCase().slice(-8)
    await api.createWork({ id: wkId, ...data, username: currentUser.value.username })
    await loadWorks()
  } catch (e) { alert(e.message) }
}

// ---- 初始化 ----
if (!currentUser.value) page.value = 'auth'
else { loadBookings(); loadWorks() }
</script>

<template>
  <div class="app">
    <ParticleBg />
    <AppHeader
      :current-page="page" :current-user="currentUser" :is-admin="isAdmin"
      @navigate="page = $event" @logout="logout"
    />

    <Transition name="page-fade" mode="out-in">
      <AuthPage
        v-if="page === 'auth'" key="auth"
        @login="onLogin"
      />

      <div v-else-if="page === 'home'" key="home">
        <HeroBanner />
        <div class="content-area">
          <div class="section-title">探 寻 非 遗</div>
          <div class="cat-grid">
            <CategoryCard v-for="cat in CATEGORIES" :key="cat.id" :category="cat" @select="openCategory" />
          </div>
          <ChinaMap />
        </div>
      </div>

      <DetailPage
        v-else-if="page === 'detail'" key="detail"
        :category="currentCat" :detail-tab="detailTab" :video-bgs="VIDEO_BGS"
        @back="goHome" @tab-change="detailTab = $event" @play-video="openVideo"
      />

      <BookingPage
        v-else-if="page === 'booking'" key="booking"
        :categories="CATEGORIES" :time-slots="TIME_SLOTS" :bookings="bookings"
        @submit="submitBooking" @back="goHome"
      />

      <MyPage
        v-else-if="page === 'my'" key="my"
        :bookings="myBookings" :works="myWorks" :notifications="notifications" :unread-count="unreadCount"
        :categories="CATEGORIES" :time-slots="TIME_SLOTS" :my-tab="myTab"
        @tab-change="myTab = $event" @upload-work="submitWork" @delete-work="deleteWork"
        @mark-read="markRead" @back="goHome"
      />

      <AdminPage
        v-else-if="page === 'admin'" key="admin"
        :current-user="currentUser"
        @back="goHome"
      />
    </Transition>

    <ConfirmModal :show="showModal" :message="modalMsg" @close="showModal = false; page = 'my'; myTab = 'bookings'" />
    <VideoModal :show="showVideo" :title="videoTitle" @close="showVideo = false" />

    <div class="footer"><p>非遗传承 · 指尖上的中国 © 2026</p></div>
  </div>
</template>
