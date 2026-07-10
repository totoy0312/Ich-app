<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../api.js'
import { CATEGORIES } from '../../data.js'

const contents = ref([])
const contentType = ref('article')
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ catId: 'papercut', title: '', content: '', description: '' })

const filteredContents = computed(() => contents.value.filter(c => c.type === contentType.value))

async function loadContents() {
  try { contents.value = await api.getAllContents() } catch {}
}

function openForm(item) {
  if (item) {
    editingId.value = item.id
    form.value = { catId: item.cat_id, title: item.title, content: item.content, description: item.description || '' }
  } else {
    editingId.value = null
    form.value = { catId: 'papercut', title: '', content: '', description: '' }
  }
  showForm.value = true
}

async function saveContent() {
  const data = { catId: form.value.catId, type: contentType.value, title: form.value.title,
    content: form.value.content, description: form.value.description }
  try {
    if (editingId.value) {
      await api.updateContent(editingId.value, data)
    } else {
      await api.createContent(data)
    }
    showForm.value = false
    await loadContents()
  } catch (e) { alert(e.message) }
}

async function confirmDelete(id) {
  if (!confirm('确定删除？')) return
  await api.deleteContent(id)
  await loadContents()
}

function catName(id) { return CATEGORIES.find(c => c.id === id)?.name || id }

onMounted(loadContents)
</script>

<template>
  <div class="admin-panel">
    <h2 class="admin-panel-title">内容管理</h2>
    <div class="tab-bar">
      <button :class="{ active: contentType === 'article' }" @click="contentType = 'article'">📖 文章</button>
      <button :class="{ active: contentType === 'video' }" @click="contentType = 'video'">🎬 视频</button>
    </div>
    <button class="btn-primary add-btn" @click="openForm(null)">+ 新增{{ contentType === 'article' ? '文章' : '视频' }}</button>

    <div v-if="filteredContents.length === 0" class="empty-small">暂无内容</div>
    <div v-for="item in filteredContents" :key="item.id" class="content-item">
      <div class="content-item-info">
        <h4>{{ item.title }}</h4>
        <span class="cat-tag">{{ catName(item.cat_id) }}</span>
        <p>{{ item.description || item.content?.slice(0, 80) }}</p>
      </div>
      <div class="content-item-actions">
        <button class="btn-sm" @click="openForm(item)">编辑</button>
        <button class="btn-sm btn-danger" @click="confirmDelete(item.id)">删除</button>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="content-form-modal">
        <h3>{{ editingId ? '编辑' : '新增' }}{{ contentType === 'article' ? '文章' : '视频' }}</h3>
        <div class="form-group">
          <label>分类</label>
          <select v-model="form.catId">
            <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" placeholder="标题">
        </div>
        <div v-if="contentType === 'video'" class="form-group">
          <label>描述</label>
          <input v-model="form.description" placeholder="视频简介">
        </div>
        <div class="form-group">
          <label>{{ contentType === 'article' ? '正文' : '视频链接' }}</label>
          <textarea v-if="contentType === 'article'" v-model="form.content" rows="10" placeholder="文章正文..."></textarea>
          <input v-else v-model="form.content" placeholder="https://...">
        </div>
        <div class="form-actions">
          <button @click="showForm = false">取消</button>
          <button class="btn-primary" @click="saveContent">{{ editingId ? '保存' : '创建' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
