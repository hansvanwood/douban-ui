<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面不见了</h2>
      <p class="error-desc">您访问的页面可能已被移动或删除</p>
      <div class="error-actions">
        <button class="btn-primary" @click="router.push('/')">返回首页</button>
        <button class="btn-outline" @click="router.go(-1)">返回上一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary), #8dd87a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
}

.error-desc {
  font-size: 15px;
  color: var(--color-text-muted);
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 480px) {
  .error-code { font-size: 80px; }
  .error-title { font-size: 22px; }
  .error-actions { flex-direction: column; }
}
</style>
