<script setup>
defineProps(['catName', 'date', 'timeLabel', 'people', 'name'])
</script>

<template>
  <div class="booking-preview">
    <h3>📋 预约预览</h3>
    <div class="preview-item"><span class="label">项目</span><span class="value">{{ catName || '—' }}</span></div>
    <div class="preview-item"><span class="label">日期</span><span class="value">{{ date || '—' }}</span></div>
    <div class="preview-item"><span class="label">时段</span><span class="value">{{ timeLabel }}</span></div>
    <div class="preview-item"><span class="label">人数</span><span class="value">{{ people }} 人</span></div>
    <div class="preview-item"><span class="label">姓名</span><span class="value">{{ name || '—' }}</span></div>
    <div class="preview-item"><span class="label">时长</span><span class="value">约 90 分钟</span></div>
    <div class="preview-item" style="border:none;"><span class="label">费用</span><span class="value" style="color:var(--red);font-size:20px;">免费</span></div>
  </div>
</template>
