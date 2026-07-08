<script setup>
import { ref, computed } from 'vue'

defineProps(['categories'])
const emit = defineEmits(['upload'])

const catId = ref('')
const url = ref('')
const desc = ref('')

const canUpload = computed(() => catId.value && url.value.trim() && desc.value.trim())

function doUpload() {
  emit('upload', { catId: catId.value, url: url.value.trim(), desc: desc.value.trim() })
  catId.value = ''; url.value = ''; desc.value = ''
}
</script>

<template>
  <div class="upload-bar">
    <div class="form-group">
      <label>选择项目</label>
      <select v-model="catId">
        <option value="">选择非遗项目</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <div class="form-group"><label>作品图片URL</label><input v-model="url" placeholder="粘贴图片链接"></div>
    <div class="form-group"><label>作品描述</label><input v-model="desc" placeholder="一句话描述你的作品"></div>
    <button class="upload-btn" :disabled="!canUpload" @click="doUpload">上传作品</button>
  </div>
</template>
