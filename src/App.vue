<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <router-view />
  </main>
</template>

<style>
.app-main {
  padding-top: var(--header-height);
  min-height: 100vh;
}
</style>
