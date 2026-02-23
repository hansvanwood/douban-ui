<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWorkerDetail } from '@/api/worker'
import { fetchMovieList } from '@/api/movie'
import { hashColor, formatDate, getInitial } from '@/utils/parse'
import Breadcrumb from '@/components/Breadcrumb.vue'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const router = useRouter()

const worker = ref<any>(null)
const loading = ref(true)
const notFound = ref(false)

// 相关作品
const relatedMovies = ref<any[]>([])
const relatedLoading = ref(false)

// 职业标签
const professions = computed(() => {
  if (!worker.value?.profession) return []
  return worker.value.profession.split('/').map((p: string) => p.trim()).filter(Boolean)
})

// 头像颜色
const avatarColor = computed(() => hashColor(worker.value?.workerId || 0))

// 名字首字
const initial = computed(() => getInitial(worker.value?.nameZh || worker.value?.nameEn || ''))

// 面包屑 — 根据来源页面动态构建
const breadcrumbs = computed(() => {
  const from = router.options.history.state?.back as string
  const items: { label: string; to?: string }[] = [{ label: '首页', to: '/' }]
  // 如果从电影详情来
  if (from && from.startsWith('/movies/')) {
    items.push({ label: '电影列表', to: '/movies' })
    items.push({ label: '电影详情', to: from })
  }
  items.push({ label: worker.value?.nameZh || '电影人' })
  return items
})

// 加载
const loadWorker = async () => {
  loading.value = true
  notFound.value = false
  try {
    const res: any = await fetchWorkerDetail(route.params.workerId as string)
    worker.value = res?.data || res
    loadRelatedMovies()
  } catch (e: any) {
    if (e?.code === 404) {
      notFound.value = true
    } else {
      console.error('加载电影人详情失败', e)
    }
  } finally {
    loading.value = false
  }
}

const loadRelatedMovies = async () => {
  if (!worker.value) return
  relatedLoading.value = true
  try {
    const keyword = worker.value.nameZh || worker.value.workerName || ''
    if (!keyword) return
    const res: any = await fetchMovieList({
      keyword,
      pageNum: 1,
      pageSize: 8,
      sortField: 'douban_score',
      sortOrder: 'desc'
    })
    // PageResult 格式：total/data 在顶层
    relatedMovies.value = res?.data || []
  } catch (e) {
    console.error('加载相关作品失败', e)
  } finally {
    relatedLoading.value = false
  }
}

const goToAllMovies = () => {
  const keyword = worker.value?.nameZh || worker.value?.workerName || ''
  router.push({ path: '/movies', query: { keyword } })
}

onMounted(loadWorker)

watch(() => route.params.workerId, () => {
  loadWorker()
})
</script>

<template>
  <Breadcrumb :items="breadcrumbs" />

  <!-- 加载中 -->
  <div v-if="loading" class="detail-loading">
    <div class="spinner"></div>
  </div>

  <!-- 404 -->
  <div v-else-if="notFound" class="detail-not-found">
    <h2>电影人不存在</h2>
    <p>该电影人可能已被删除或 ID 无效</p>
    <button class="btn-primary" @click="router.push('/movies')">返回电影列表</button>
  </div>

  <!-- 电影人详情 -->
  <div v-else-if="worker" class="worker-detail-page page-container">
    <!-- Hero 区 -->
    <section class="worker-hero">
      <div class="worker-avatar" :style="{ background: avatarColor }">
        {{ initial }}
      </div>
      <div class="worker-info">
        <h1 class="worker-name-zh">{{ worker.nameZh }}</h1>
        <p v-if="worker.nameEn" class="worker-name-en">{{ worker.nameEn }}</p>

        <!-- 职业标签 -->
        <div v-if="professions.length" class="worker-professions">
          <span v-for="p in professions" :key="p" class="tag-capsule">{{ p }}</span>
        </div>

        <!-- 信息列表 -->
        <div class="info-list">
          <div class="info-row" v-if="worker.gender">
            <span class="info-label">性别</span>
            <span class="info-value">{{ worker.gender }}</span>
          </div>
          <div class="info-row" v-if="worker.constellatory">
            <span class="info-label">星座</span>
            <span class="info-value">{{ worker.constellatory }}</span>
          </div>
          <div class="info-row" v-if="worker.birth">
            <span class="info-label">出生日期</span>
            <span class="info-value">{{ formatDate(worker.birth) }}</span>
          </div>
          <div class="info-row" v-if="worker.birthplace">
            <span class="info-label">出生地</span>
            <span class="info-value">{{ worker.birthplace }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 人物简介 -->
    <section class="content-section">
      <h2 class="section-title">人物简介</h2>
      <p v-if="worker.biography" class="bio-text">{{ worker.biography }}</p>
      <p v-else class="bio-empty">暂无简介</p>
    </section>

    <!-- 相关作品 -->
    <section class="content-section">
      <div class="related-header">
        <h2 class="section-title">相关作品</h2>
        <button v-if="relatedMovies.length > 0" class="btn-outline btn-sm" @click="goToAllMovies">
          查看全部 →
        </button>
      </div>

      <div v-if="relatedLoading" class="related-loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="relatedMovies.length > 0" class="related-grid">
        <MovieCard v-for="movie in relatedMovies" :key="movie.movieId" :movie="movie" />
      </div>

      <p v-else class="bio-empty">暂无相关作品</p>
    </section>
  </div>
</template>

<style scoped>
.detail-loading,
.detail-not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-not-found h2 { font-size: 22px; }
.detail-not-found p { color: var(--color-text-muted); margin-bottom: 12px; }

.worker-detail-page {
  padding-top: 32px;
  padding-bottom: 60px;
}

/* Hero */
.worker-hero {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.worker-avatar {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.worker-info {
  flex: 1;
  min-width: 0;
}

.worker-name-zh {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.worker-name-en {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 14px;
}

.worker-professions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.info-list {
  margin-top: 8px;
}

.info-row {
  display: flex;
  gap: 12px;
  padding: 5px 0;
  font-size: 14px;
}

.info-label {
  flex-shrink: 0;
  width: 64px;
  color: var(--color-text-muted);
  text-align: right;
}

.info-value {
  flex: 1;
}

/* 简介 */
.content-section {
  margin-bottom: 36px;
}

.bio-text {
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.bio-empty {
  font-size: 14px;
  color: var(--color-text-muted);
  font-style: italic;
}

/* 相关作品 */
.related-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.related-header .section-title {
  margin-bottom: 0;
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
}

.related-loading {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

/* 响应式 */
@media (max-width: 640px) {
  .worker-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .worker-avatar {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
  .worker-name-zh {
    font-size: 24px;
  }
  .info-row {
    flex-direction: column;
    gap: 2px;
  }
  .info-label {
    width: auto;
    text-align: center;
  }
  .worker-professions {
    justify-content: center;
  }
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }
}
</style>
