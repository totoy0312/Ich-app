<script setup>
import { ref } from 'vue'

defineProps(['category', 'detailTab', 'videoBgs'])
const emit = defineEmits(['back', 'tab-change', 'play-video'])

const articleModal = ref(null)

function openArticle(a) { articleModal.value = a }
function closeArticle() { articleModal.value = null }
function openVideo(v) {
  if (v.url) {
    window.open(v.url, '_blank')
  } else {
    emit('play-video', v)
  }
}
</script>

<template>
  <div class="content-area">
    <button class="back-btn" @click="$emit('back')">← 返回首页</button>
    <div class="detail-header">
      <div class="dh-icon">{{ category.icon }}</div>
      <h2>{{ category.name }}</h2>
      <p>{{ category.desc }}</p>
    </div>
    <div class="detail-tabs">
      <button class="detail-tab" :class="{ active: detailTab === 'articles' }" @click="$emit('tab-change', 'articles')">📖 文章</button>
      <button class="detail-tab" :class="{ active: detailTab === 'videos' }" @click="$emit('tab-change', 'videos')">🎬 视频</button>
    </div>

    <!-- 文章列表 — 预览卡片 -->
    <div v-if="detailTab === 'articles'" class="article-list">
      <div v-for="(a, i) in category.articles" :key="i" class="article-card article-preview" @click="openArticle(a)">
        <h4>{{ a.title }}</h4>
        <p class="article-meta">{{ category.name }} · 文化科普</p>
        <p class="article-excerpt">{{ a.content.slice(0, 100) }}……</p>
        <span class="read-more">阅读全文 →</span>
      </div>
    </div>

    <div v-if="detailTab === 'videos'" class="video-grid">
      <div v-for="(v, i) in category.videos" :key="i" class="video-card" @click="openVideo(v)">
        <div class="video-thumb" :style="{ background: videoBgs[i % videoBgs.length] }">
          <div class="play-overlay">▶</div>
        </div>
        <div class="video-info">
          <h4>{{ v.title }}</h4>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 文章全文弹窗 -->
    <div v-if="articleModal" class="modal-overlay" @click.self="closeArticle">
      <div class="article-modal">
        <button class="article-close" @click="closeArticle">✕</button>
        <h2 class="article-modal-title">{{ articleModal.title }}</h2>
        <p class="article-modal-meta">{{ category.name }} · 文化科普</p>
        <div class="article-modal-body">
          <p>{{ articleModal.content }}</p>
        </div>
        <button class="modal-btn" style="margin-top:20px;" @click="closeArticle">关闭</button>
      </div>
    </div>
  </div>
</template>
