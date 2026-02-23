<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const jumpPage = ref('')

// 生成页码列表（最多7个，超出用 -1 表示省略号）
const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const result: number[] = [1]
  if (current > 3) result.push(-1)
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) result.push(i)
  if (current < total - 2) result.push(-1)
  result.push(total)
  return result
})

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}

const handleJump = () => {
  const page = parseInt(jumpPage.value)
  if (!isNaN(page) && page >= 1 && page <= props.totalPages) {
    goToPage(page)
  }
  jumpPage.value = ''
}

watch(() => props.currentPage, () => {
  jumpPage.value = ''
})
</script>

<template>
  <div v-if="totalPages > 0" class="pagination">
    <button
      class="page-btn"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    >
      上一页
    </button>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === -1" class="page-ellipsis">…</span>
      <button
        v-else
        :class="['page-btn', 'page-num', { active: page === currentPage }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="page-btn"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      下一页
    </button>

    <div class="page-info">
      第 {{ currentPage }} 页 / 共 {{ totalPages }} 页，共 {{ total }} 条
    </div>

    <div class="page-jump">
      <span>跳至</span>
      <input
        v-model="jumpPage"
        type="number"
        min="1"
        :max="totalPages"
        class="jump-input"
        @keyup.enter="handleJump"
      />
      <span>页</span>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition);
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.page-ellipsis {
  color: var(--color-text-muted);
  padding: 0 4px;
}

.page-info {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-left: 12px;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-left: 8px;
}

.jump-input {
  width: 56px;
  height: 32px;
  text-align: center;
  font-size: 13px;
  padding: 4px 8px;
}

/* 隐藏 number 输入框箭头 */
.jump-input::-webkit-inner-spin-button,
.jump-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.jump-input {
  -moz-appearance: textfield;
}

@media (max-width: 640px) {
  .page-info,
  .page-jump {
    display: none;
  }
}
</style>
