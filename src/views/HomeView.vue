<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMovieStats } from '@/api/movie'
import { useMovieStore } from '@/stores/movieStore'
import CountUp from '@/components/CountUp.vue'

const router = useRouter()
const movieStore = useMovieStore()

const loaded = ref(false)
const movieCount = ref(0)
const commentCount = ref(0)
const workerCount = ref(0)

onMounted(async () => {
  try {
    // 优先使用缓存
    if (movieStore.stats) {
      movieCount.value = movieStore.stats.movieCount
      commentCount.value = movieStore.stats.commentCount
      workerCount.value = movieStore.stats.workerCount
      loaded.value = true
      return
    }
    const res: any = await fetchMovieStats()
    const data = res?.data || res
    movieCount.value = data.movieCount || 0
    commentCount.value = data.commentCount || 0
    workerCount.value = data.workerCount || 0
    movieStore.setStats({ movieCount: movieCount.value, commentCount: commentCount.value, workerCount: workerCount.value })
    loaded.value = true
  } catch (e) {
    console.error('获取统计数据失败', e)
    loaded.value = true
  }
})

const goToMovies = () => router.push('/movies')
</script>

<template>
  <div class="home-page">
    <!-- 主视觉区 -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-particles">
          <span v-for="i in 6" :key="i" :class="'particle p' + i"></span>
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">探索</span>
          <span class="title-line accent">光影世界</span>
        </h1>
        <p class="hero-subtitle" v-if="loaded">
          收录 <strong>{{ movieCount.toLocaleString() }}</strong> 部电影，<strong>{{ commentCount.toLocaleString() }}</strong> 条真实评论
        </p>
        <p class="hero-subtitle" v-else>加载中...</p>
      </div>
    </section>

    <!-- 统计卡片区 -->
    <section class="stats-section" v-if="loaded">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎬</div>
          <div class="stat-number">
            <CountUp :target="movieCount" />
          </div>
          <div class="stat-label">部电影</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-number">
            <CountUp :target="commentCount" />
          </div>
          <div class="stat-label">条评论</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎭</div>
          <div class="stat-number">
            <CountUp :target="workerCount" />
          </div>
          <div class="stat-label">位电影人</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <button class="btn-cta" @click="goToMovies">
        <span>探索电影</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </section>

    <!-- 页脚 -->
    <footer class="home-footer">
      <p>© 2026 豆瓣酱. 全栈技术展示.</p>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-size: cover;
  background: url('/home-background.jpeg') no-repeat fixed center center;
}

.home-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85); /* 黑色半透明遮罩 */
  pointer-events: none;
  z-index: 0;
}

.home-page > * {
  position: relative;
  z-index: 1;
}

/* Hero 区 */
.hero-section {
  position: relative;
  width: 100%;
  padding: 120px 24px 60px;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, rgba(96, 168, 78, 0.08) 0%, transparent 60%);
}

.hero-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.15;
  animation: float 6s ease-in-out infinite;
}

.p1 { top: 20%; left: 15%; animation-delay: 0s; }
.p2 { top: 60%; left: 80%; animation-delay: 1s; }
.p3 { top: 30%; left: 70%; animation-delay: 2s; width: 4px; height: 4px; }
.p4 { top: 70%; left: 25%; animation-delay: 3s; width: 8px; height: 8px; }
.p5 { top: 45%; left: 50%; animation-delay: 4s; }
.p6 { top: 80%; left: 60%; animation-delay: 5s; width: 5px; height: 5px; }

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
  50% { transform: translateY(-20px) scale(1.3); opacity: 0.3; }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.title-line {
  display: block;
}

.title-line.accent {
  background: linear-gradient(135deg, var(--color-primary), #8dd87a, var(--color-primary));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.hero-subtitle strong {
  color: var(--color-primary);
  font-weight: 600;
}

/* 统计卡片 */
.stats-section {
  width: 100%;
  max-width: 800px;
  padding: 0 24px 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 28px 20px;
  text-align: center;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), #8dd87a);
  opacity: 0;
  transition: opacity var(--transition);
}

.stat-card:hover {
  border-color: rgba(96, 168, 78, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* CTA */
.cta-section {
  padding: 20px 24px 60px;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, var(--color-primary), #4e8f3e);
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(96, 168, 78, 0.3);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(96, 168, 78, 0.5);
}

.btn-cta svg {
  transition: transform 0.3s ease;
}

.btn-cta:hover svg {
  transform: translateX(4px);
}

/* 页脚 */
.home-footer {
  margin-top: auto;
  padding: 40px 24px;
  text-align: center;
  font-size: 16px;
  color: var(--color-text-muted);
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 640px) {
  .hero-title {
    font-size: 36px;
  }
  .hero-subtitle {
    font-size: 15px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .stat-number {
    font-size: 28px;
  }
}
</style>
