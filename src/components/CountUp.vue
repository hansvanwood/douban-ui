<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  target: number
}>()

const current = ref(0)

const animate = () => {
  const startTime = performance.now()
  const duration = 1500 // 1.5秒

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 缓动函数：easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    current.value = Math.floor(eased * props.target)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      current.value = props.target
    }
  }

  requestAnimationFrame(step)
}

onMounted(() => {
  if (props.target > 0) animate()
})

watch(() => props.target, (newVal) => {
  if (newVal > 0) animate()
})
</script>

<template>
  <span class="count-up">{{ current.toLocaleString() }}</span>
</template>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
