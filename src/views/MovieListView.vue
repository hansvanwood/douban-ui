<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchMovieList } from '@/api/movie'
import { useFilterStore } from '@/stores/filterStore'
import { useMovieStore } from '@/stores/movieStore'
import Breadcrumb from '@/components/Breadcrumb.vue'
import MovieCard from '@/components/MovieCard.vue'
import Pagination from '@/components/Pagination.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const filterStore = useFilterStore()
const movieStore = useMovieStore()

// 面包屑
const breadcrumbs = [
  { label: '首页', to: '/' },
  { label: '电影列表' }
]

// 筛选参数
const filters = reactive({
  keyword: '',
  type: '',
  language: '',
  region: '',
  year: '',
  minMinutes: '',
  maxMinutes: '',
  sortField: 'douban_score',
  sortOrder: 'desc',
  pageNum: 1,
  pageSize: 20
})

const loading = ref(false)
const movies = ref<any[]>([])
const total = ref(0)
const totalPages = ref(0)
const mobileFilterOpen = ref(false)

// 排序选项
const sortOptions = [
  { label: '豆瓣评分从高到低', sortField: 'douban_score', sortOrder: 'desc' },
  { label: '豆瓣评分从低到高', sortField: 'douban_score', sortOrder: 'asc' },
  { label: '上映时间从新到旧', sortField: 'release_date', sortOrder: 'desc' },
  { label: '上映时间从旧到新', sortField: 'release_date', sortOrder: 'asc' },
  { label: '电影时长从长到短', sortField: 'minutes', sortOrder: 'desc' },
  { label: '电影时长从短到长', sortField: 'minutes', sortOrder: 'asc' },
  { label: '片名 A-Z', sortField: 'movie_name', sortOrder: 'asc' }
]

const currentSortLabel = computed(() => {
  const found = sortOptions.find(o => o.sortField === filters.sortField && o.sortOrder === filters.sortOrder)
  return found ? found.label : '豆瓣评分从高到低'
})

// 从 URL 初始化筛选参数
const initFromUrl = () => {
  const q = route.query
  filters.keyword = (q.keyword as string) || ''
  filters.type = (q.type as string) || ''
  filters.language = (q.language as string) || ''
  filters.region = (q.region as string) || ''
  filters.year = (q.year as string) || ''
  filters.minMinutes = (q.minMinutes as string) || ''
  filters.maxMinutes = (q.maxMinutes as string) || ''
  filters.sortField = (q.sortField as string) || 'douban_score'
  filters.sortOrder = (q.sortOrder as string) || 'desc'
  filters.pageNum = parseInt(q.pageNum as string) || 1
  filters.pageSize = parseInt(q.pageSize as string) || 20
}

// 同步到 URL
const syncToUrl = () => {
  const query: Record<string, string> = {}
  if (filters.keyword) query.keyword = filters.keyword
  if (filters.type) query.type = filters.type
  if (filters.language) query.language = filters.language
  if (filters.region) query.region = filters.region
  if (filters.year) query.year = filters.year
  if (filters.minMinutes) query.minMinutes = filters.minMinutes
  if (filters.maxMinutes) query.maxMinutes = filters.maxMinutes
  if (filters.sortField !== 'douban_score' || filters.sortOrder !== 'desc') {
    query.sortField = filters.sortField
    query.sortOrder = filters.sortOrder
  }
  if (filters.pageNum > 1) query.pageNum = String(filters.pageNum)
  router.replace({ query })
}

// 加载电影列表
const loadMovies = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      pageNum: filters.pageNum,
      pageSize: filters.pageSize,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder
    }
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.type) params.type = filters.type
    if (filters.language) params.language = filters.language
    if (filters.region) params.region = filters.region
    if (filters.year) params.year = filters.year
    if (filters.minMinutes) params.minMinutes = Number(filters.minMinutes)
    if (filters.maxMinutes) params.maxMinutes = Number(filters.maxMinutes)

    const res: any = await fetchMovieList(params)
    // PageResult 格式：total/data 在顶层
    movies.value = res?.data || []
    total.value = res?.total || 0
    totalPages.value = Math.ceil(total.value / filters.pageSize) || 0

    syncToUrl()
  } catch (e) {
    console.error('加载电影列表失败', e)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  filters.pageNum = 1
  loadMovies()
}

// 重置
const handleReset = () => {
  filters.keyword = ''
  filters.type = ''
  filters.language = ''
  filters.region = ''
  filters.year = ''
  filters.minMinutes = ''
  filters.maxMinutes = ''
  filters.sortField = 'douban_score'
  filters.sortOrder = 'desc'
  filters.pageNum = 1
  loadMovies()
}

// 排序变更
const handleSortChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value
  const opt = sortOptions[parseInt(val)]
  if (opt) {
    filters.sortField = opt.sortField
    filters.sortOrder = opt.sortOrder
    filters.pageNum = 1
    loadMovies()
  }
}

const currentSortIndex = computed(() => {
  return sortOptions.findIndex(o => o.sortField === filters.sortField && o.sortOrder === filters.sortOrder)
})

// 分页
const handlePageChange = (page: number) => {
  filters.pageNum = page
  loadMovies()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 防抖搜索
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const handleKeywordInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filters.pageNum = 1
    loadMovies()
  }, 500)
}

// 监听浏览器前进/后退
watch(() => route.query, () => {
  initFromUrl()
  loadMovies()
}, { deep: false })

onMounted(async () => {
  await filterStore.loadFilters()
  initFromUrl()
  loadMovies()
})

// 骨架屏卡片数量
const skeletonCount = 12
</script>

<template>
  <Breadcrumb :items="breadcrumbs" />
  <div class="movie-list-page page-container">
    <!-- 移动端筛选按钮 -->
    <button class="filter-toggle" @click="mobileFilterOpen = !mobileFilterOpen">
      <span>🔍 筛选</span>
      <span v-if="mobileFilterOpen">▲</span>
      <span v-else>▼</span>
    </button>

    <div class="list-layout">
      <!-- 左侧筛选栏 -->
      <aside :class="['filter-sidebar', { open: mobileFilterOpen }]">
        <div class="filter-group">
          <label class="filter-label">关键词</label>
          <input
            v-model="filters.keyword"
            type="text"
            placeholder="搜索电影名..."
            class="filter-input"
            @input="handleKeywordInput"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">类型</label>
          <select v-model="filters.type" class="filter-select">
            <option value="">全部</option>
            <option v-for="g in filterStore.types" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">语言</label>
          <select v-model="filters.language" class="filter-select">
            <option value="">全部</option>
            <option v-for="l in filterStore.languages" :key="l" :value="l">{{ l }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">地区</label>
          <select v-model="filters.region" class="filter-select">
            <option value="">全部</option>
            <option v-for="r in filterStore.regions" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">年份</label>
          <input
            v-model="filters.year"
            type="text"
            placeholder="如 2024"
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">时长（分钟）</label>
          <div class="filter-range">
            <input v-model="filters.minMinutes" type="number" placeholder="最短" class="filter-input range-input" />
            <span class="range-sep">-</span>
            <input v-model="filters.maxMinutes" type="number" placeholder="最长" class="filter-input range-input" />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">排序</label>
          <select :value="currentSortIndex" class="filter-select" @change="handleSortChange">
            <option v-for="(opt, idx) in sortOptions" :key="idx" :value="idx">{{ opt.label }}</option>
          </select>
        </div>

        <div class="filter-actions">
          <button class="btn-primary filter-btn" @click="handleSearch">搜索</button>
          <button class="btn-outline filter-btn" @click="handleReset">重置</button>
        </div>
      </aside>

      <!-- 右侧电影列表 -->
      <main class="list-main">
        <div class="list-header">
          <span class="list-total">共找到 {{ total }} 部电影</span>
        </div>

        <!-- 加载骨架屏 -->
        <div v-if="loading" class="movie-grid">
          <div v-for="i in skeletonCount" :key="i" class="skeleton-card">
            <div class="skeleton skeleton-poster"></div>
            <div class="skeleton-info">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>

        <!-- 电影网格 -->
        <div v-else-if="movies.length > 0" class="movie-grid">
          <MovieCard v-for="movie in movies" :key="movie.movieId" :movie="movie" />
        </div>

        <!-- 空状态 -->
        <EmptyState v-else message="没有找到匹配的电影，试试调整筛选条件" />

        <!-- 分页器 -->
        <Pagination
          v-if="totalPages > 1"
          :currentPage="filters.pageNum"
          :totalPages="totalPages"
          :total="total"
          @update:currentPage="handlePageChange"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.movie-list-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

/* 移动端筛选切换 */
.filter-toggle {
  display: none;
  width: 100%;
  padding: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

/* 双栏布局 */
.list-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧筛选栏 */
.filter-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--header-height) + var(--breadcrumb-height) + 16px);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
  font-weight: 500;
}

.filter-input,
.filter-select {
  width: 100%;
  height: 36px;
  font-size: 13px;
}

.filter-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.filter-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
  min-width: 0;
}

.range-sep {
  color: var(--color-text-muted);
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.filter-btn {
  flex: 1;
  height: 36px;
  font-size: 13px;
  padding: 0;
}

/* 右侧列表 */
.list-main {
  flex: 1;
  min-width: 0;
}

.list-header {
  margin-bottom: 16px;
}

.list-total {
  font-size: 14px;
  color: var(--color-text-muted);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* 骨架屏 */
.skeleton-card {
  border-radius: var(--radius-card);
  overflow: hidden;
}

.skeleton-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}

.skeleton-info {
  padding: 12px;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-text {
  height: 12px;
  width: 50%;
  border-radius: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .filter-toggle {
    display: flex;
  }
  .filter-sidebar {
    position: static;
    width: 100%;
    display: none;
    margin-bottom: 16px;
  }
  .filter-sidebar.open {
    display: block;
  }
  .list-layout {
    flex-direction: column;
  }
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>
