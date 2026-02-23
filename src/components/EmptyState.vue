<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: '暂无数据'
})
</script>

<template>
  <div class="empty-state">
    <svg class="empty-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" stroke="#333" stroke-width="2" stroke-dasharray="6 4" />
      <path d="M42 55c0-2 1.5-3.5 3.5-3.5S49 53 49 55M71 55c0-2 1.5-3.5 3.5-3.5S78 53 78 55" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M45 75c4.5-4 12-6 15-6s10.5 2 15 6" stroke="#555" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <circle cx="95" cy="25" r="6" fill="#333"/>
      <circle cx="25" cy="90" r="4" fill="#2a2a2a"/>
    </svg>
    <p class="empty-text">{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text {
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
