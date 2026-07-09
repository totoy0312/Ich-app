<script setup>
import { ref, computed } from 'vue'

defineProps(['categories'])
const emit = defineEmits(['upload'])

const catId = ref('')
const desc = ref('')
const imageData = ref(null)
const imageName = ref('')
const dragging = ref(false)
const fileInput = ref(null)

const canUpload = computed(() => catId.value && imageData.value && desc.value.trim())

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxSize = 500
        let w = img.width, h = img.height
        if (w > h && w > maxSize) { h = h * maxSize / w; w = maxSize }
        else if (h > maxSize) { w = w * maxSize / h; h = maxSize }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('无法解析图片文件'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('无法读取文件'))
    reader.readAsDataURL(file)
  })
}

async function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return
  try {
    imageName.value = file.name
    imageData.value = await resizeImage(file)
  } catch (e) {
    console.error('图片加载失败:', e)
  }
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) handleFile(file)
}

function onDragOver(e) {
  e.preventDefault()
  dragging.value = true
}

function onDragLeave() {
  dragging.value = false
}

function onDrop(e) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) handleFile(file)
}

function triggerInput() {
  fileInput.value.click()
}

function removeImage() {
  imageData.value = null
  imageName.value = ''
}

function doUpload() {
  emit('upload', { catId: catId.value, image: imageData.value, desc: desc.value.trim() })
  catId.value = ''; desc.value = ''; imageData.value = null; imageName.value = ''
}
</script>

<template>
  <div class="upload-bar">
    <div class="upload-zone"
      :class="{ dragging }"
      @click="triggerInput"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input ref="fileInput" type="file" accept="image/*" class="visually-hidden" @change="onFileChange">
      <template v-if="imageData">
        <img :src="imageData" class="upload-preview">
        <div class="upload-overlay">
          <span class="upload-remove" @click.stop="removeImage">✕ 移除</span>
        </div>
      </template>
      <template v-else>
        <span class="upload-plus">+</span>
        <span class="upload-text">上传作品图片</span>
        <span class="upload-hint">支持 JPG/PNG，拖拽或点击上传</span>
      </template>
    </div>

    <div class="upload-fields">
      <div class="form-group">
        <label>选择项目</label>
        <select v-model="catId">
          <option value="">选择非遗项目</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <div class="form-group"><label>作品描述</label><input v-model="desc" placeholder="一句话描述你的作品"></div>
      <button class="upload-btn" :disabled="!canUpload" @click="doUpload">上传作品</button>
    </div>
  </div>
</template>
