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
    <p class="subtitle">· 非 物 质 文 化 遗 产 ·</p>
    <h2>{{ displayTitle }}<span class="cursor-blink">|</span></h2>
    <div class="deco-line"></div>
    <p :class="{ 'fade-in': showDesc }">探寻千年技艺，感受东方美学。<br>选择一项非遗文化，开启你的传承之旅。</p>
  </div>
</template>
