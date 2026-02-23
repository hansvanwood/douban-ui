<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  score: number     // 0-10 豆瓣评分，或 0-5 直接评分
  size?: 'sm' | 'md' | 'lg'
  max?: number      // 满分值，默认 10（豆瓣评分），传 5 表示直接 5 分制
}>(), {
  size: 'md',
  max: 10
})

// 转为 5 星制评分
const starRating = computed(() => {
  return props.max === 5 ? props.score : props.score / 2
})

// 生成 5 颗星状态：full / half / empty
const stars = computed(() => {
  const rating = starRating.value
  const result: ('full' | 'half' | 'empty')[] = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      result.push('full')
    } else if (rating >= i - 0.5) {
      result.push('half')
    } else {
      result.push('empty')
    }
  }
  return result
})

const sizeClass = computed(() => `star-${props.size}`)
</script>

<template>
  <div :class="['star-rating', sizeClass]">
    <span v-for="(state, index) in stars" :key="index" class="star-item">
      <!-- 实心星 -->
      <svg v-if="state === 'full'" viewBox="0 0 24 24" fill="currentColor" class="star-icon star-full">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <!-- 半星 -->
      <svg v-else-if="state === 'half'" viewBox="0 0 24 24" class="star-icon star-half">
        <defs>
          <linearGradient :id="'half-grad-' + index">
            <stop offset="50%" :stop-color="'var(--color-gold)'" />
            <stop offset="50%" stop-color="#444" />
          </linearGradient>
        </defs>
        <path :fill="`url(#half-grad-${index})`" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <!-- 空星 -->
      <svg v-else viewBox="0 0 24 24" fill="currentColor" class="star-icon star-empty">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star-item {
  display: inline-flex;
}

.star-icon {
  flex-shrink: 0;
}

.star-full {
  color: var(--color-gold);
}

.star-empty {
  color: #444;
}

/* 尺寸 */
.star-sm .star-icon { width: 14px; height: 14px; }
.star-md .star-icon { width: 18px; height: 18px; }
.star-lg .star-icon { width: 22px; height: 22px; }
</style>
