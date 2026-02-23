<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <div class="breadcrumb-bar">
    <div class="breadcrumb-inner">
      <template v-for="(item, index) in items" :key="index">
        <router-link v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb-current">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="breadcrumb-sep">›</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-bar {
  position: sticky;
  top: var(--header-height);
  z-index: 90;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  height: var(--breadcrumb-height);
  display: flex;
  align-items: center;
}

.breadcrumb-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.breadcrumb-link {
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-sep {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--color-text);
  font-weight: 500;
}
</style>
