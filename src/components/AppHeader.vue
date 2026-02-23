<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 判断当前路由是否匹配导航项
const isActive = (name: string) => {
  if (name === 'Home') return route.name === 'Home'
  if (name === 'MovieList') return ['MovieList', 'MovieDetail'].includes(route.name as string)
  return false
}

const navItems = computed(() => [
  { name: 'Home', label: '首页', to: '/' },
  { name: 'MovieList', label: '电影', to: '/movies' }
])
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="header-logo">
        <img src="@/assets/logo.png" alt="豆瓣酱 Logo" class="logo-img" />
        <span class="logo-text">豆瓣酱</span>
      </router-link>
      <nav class="header-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          :class="['nav-link', { active: isActive(item.name) }]"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  transition: opacity var(--transition);
}

.header-logo:hover {
  opacity: 0.85;
}

.logo-img {
  height: 36px;
  width: auto;
}

.logo-text {
  background: linear-gradient(135deg, var(--color-primary), #8dd87a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 15px;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
  transition: transform var(--transition);
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link.active {
  color: var(--color-primary);
}

.nav-link.active::after {
  transform: translateX(-50%) scaleX(1);
}
</style>
