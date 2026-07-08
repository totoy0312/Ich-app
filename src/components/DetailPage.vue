<script setup>
defineProps(['category', 'detailTab', 'videoBgs'])
defineEmits(['back', 'tab-change', 'play-video'])
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

    <div v-if="detailTab === 'articles'" class="article-list">
      <div v-for="(a, i) in category.articles" :key="i" class="article-card">
        <h4>{{ a.title }}</h4>
        <p class="article-meta">{{ category.name }} · 文化科普</p>
        <p>{{ a.content }}</p>
      </div>
    </div>

    <div v-if="detailTab === 'videos'" class="video-grid">
      <div v-for="(v, i) in category.videos" :key="i" class="video-card" @click="$emit('play-video', v)">
        <div class="video-thumb" :style="{ background: videoBgs[i % videoBgs.length] }">
          <div class="play-overlay">▶</div>
        </div>
        <div class="video-info">
          <h4>{{ v.title }}</h4>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
