<script setup lang="ts">
const reload = () => {
  window.location.reload()
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">500</h1>
      <h2 class="error-title">服务器开小差了</h2>
      <p class="error-desc">请稍后重试，或联系管理员</p>
      <div class="error-actions">
        <a href="/" class="btn-primary">返回首页</a>
        <button class="btn-outline" @click="reload">刷新页面</button>
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
  background: linear-gradient(135deg, #e74c3c, #e67e22);
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
