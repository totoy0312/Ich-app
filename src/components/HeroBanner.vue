<script setup>
import { ref, onMounted } from 'vue'

const displayTitle = ref('')
const showDesc = ref(false)
const fullTitle = '指尖上的中国'
let idx = 0

onMounted(() => {
  const timer = setInterval(() => {
    if (idx < fullTitle.length) {
      displayTitle.value += fullTitle[idx]
      idx++
    } else {
      clearInterval(timer)
      showDesc.value = true
    }
  }, 200)
})
</script>

<template>
  <div class="hero">
    <p class="subtitle">· 非遗体验课在线预约平台 ·</p>
    <h2>{{ displayTitle }}<span class="cursor-blink">|</span></h2>
    <div class="deco-line"></div>
    <p :class="{ 'fade-in': showDesc }">连接非遗传承人与爱好者<br>在线预约体验课，上传作品展示，传承指尖技艺</p>
  </div>
</template>
