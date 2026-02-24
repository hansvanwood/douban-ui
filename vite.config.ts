import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    // 1. 禁用代码压缩和混淆
    minify: false,

    // 2. (可选) 如果你希望打包后的 CSS 也不压缩
    cssMinify: false,

    // 3. (建议) 开启源码映射，方便在浏览器调试
    sourcemap: true,

    // 4. (可选) 调整输出目录结构，让文件名更直观（不带 hash）
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
