<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchMovieDetail } from '@/api/movie'
import { fetchComments } from '@/api/comment'
import { parseWorkerIds, hashColor, formatDate, getInitial } from '@/utils/parse'
import { getPosterUrl } from '@/api/request'
import Breadcrumb from '@/components/Breadcrumb.vue'
import StarRating from '@/components/StarRating.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()

const movie = ref<any>(null)
const loading = ref(true)
const notFound = ref(false)

// 评论
const comments = ref<any[]>([])
const commentPage = ref(1)
const commentPageSize = 20
const commentTotal = ref(0)
const commentTotalPages = ref(0)
const commentLoading = ref(false)

// 主演展开
const actorsExpanded = ref(false)

// 解析导演和演员
const directors = computed(() => parseWorkerIds(movie.value?.directorIds))
const actors = computed(() => parseWorkerIds(movie.value?.actorIds))
const displayActors = computed(() => actorsExpanded.value ? actors.value : actors.value.slice(0, 6))

// 标签
const tags = computed(() => {
  if (!movie.value?.tags) return []
  return movie.value.tags.split('/').map((t: string) => t.trim()).filter(Boolean)
})

// 面包屑
const breadcrumbs = computed(() => [
  { label: '首页', to: '/' },
  { label: '电影列表', to: '/movies' },
  { label: movie.value?.movieName || '电影详情' }
])

// 海报 URL
const posterUrl = computed(() => getPosterUrl(movie.value?.cover))

// 背景图
const bgUrl = computed(() => getPosterUrl(movie.value?.cover))

// 加载电影详情
const loadDetail = async () => {
  loading.value = true
  notFound.value = false
  try {
    const res: any = await fetchMovieDetail(route.params.movieId as string)
    movie.value = res?.data || res
    // 初始评论直接使用详情接口返回的 comments 数组
    commentTotal.value = movie.value?.commentTotal || 0
    commentTotalPages.value = Math.ceil(commentTotal.value / commentPageSize) || 0
    comments.value = movie.value?.comments || []
  } catch (e: any) {
    if (e?.code === 404) {
      notFound.value = true
    } else {
      console.error('加载电影详情失败', e)
    }
  } finally {
    loading.value = false
  }
}

// 加载评论（翻页时调用）
const loadComments = async () => {
  if (!movie.value?.movieId) return
  commentLoading.value = true
  try {
    const res: any = await fetchComments(movie.value.movieId, commentPage.value, commentPageSize)
    // PageResult 格式：total/data 在顶层
    comments.value = res?.data || []
    commentTotal.value = res?.total || commentTotal.value
    commentTotalPages.value = Math.ceil(commentTotal.value / commentPageSize) || 0
  } catch (e) {
    console.error('加载评论失败', e)
  } finally {
    commentLoading.value = false
  }
}

const handleCommentPageChange = (page: number) => {
  commentPage.value = page
  loadComments()
  // 滚动到评论区顶部
  const el = document.getElementById('comments-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(loadDetail)

watch(() => route.params.movieId, () => {
  commentPage.value = 1
  loadDetail()
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
    <h2>电影不存在</h2>
    <p>该电影可能已被删除或 ID 无效</p>
    <button class="btn-primary" @click="router.push('/movies')">返回电影列表</button>
  </div>

  <!-- 电影详情 -->
  <div v-else-if="movie" class="movie-detail-page">
    <!-- Hero 区 -->
    <section class="hero-section">
      <div class="hero-bg">
        <img v-if="bgUrl" :src="bgUrl" alt="" class="hero-bg-img" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content page-container">
        <div class="hero-poster">
          <img v-if="posterUrl" :src="posterUrl" :alt="movie.movieName" />
          <div v-else class="poster-placeholder">
            <span>🎬</span>
          </div>
        </div>
        <div class="hero-info">
          <h1 class="movie-title">{{ movie.movieName }}</h1>
          <p v-if="movie.movieAlias" class="movie-alias">{{ movie.movieAlias }}</p>

          <!-- 评分 -->
          <div class="rating-block" v-if="movie.doubanScore">
            <span class="rating-score">{{ movie.doubanScore }}</span>
            <StarRating :score="movie.doubanScore" size="lg" />
            <span v-if="movie.doubanVotes" class="rating-votes">{{ movie.doubanVotes }} 人评价</span>
          </div>

          <!-- 信息列表 -->
          <div class="info-list">
            <div class="info-row" v-if="directors.length">
              <span class="info-label">导演</span>
              <span class="info-value">
                <template v-for="(d, i) in directors" :key="d.id">
                  <router-link :to="`/workers/${d.id}`" class="worker-link">{{ d.name }}</router-link>
                  <span v-if="i < directors.length - 1"> / </span>
                </template>
              </span>
            </div>
            <div class="info-row" v-if="actors.length">
              <span class="info-label">主演</span>
              <span class="info-value">
                <template v-for="(a, i) in displayActors" :key="a.id">
                  <router-link :to="`/workers/${a.id}`" class="worker-link">{{ a.name }}</router-link>
                  <span v-if="i < displayActors.length - 1"> / </span>
                </template>
                <button v-if="actors.length > 6 && !actorsExpanded" class="expand-btn" @click="actorsExpanded = true">
                  展开全部 ({{ actors.length }}人)
                </button>
              </span>
            </div>
            <div class="info-row" v-if="movie.type">
              <span class="info-label">类型</span>
              <span class="info-value">{{ movie.type }}</span>
            </div>
            <div class="info-row" v-if="movie.languages">
              <span class="info-label">语言</span>
              <span class="info-value">{{ movie.languages }}</span>
            </div>
            <div class="info-row" v-if="movie.regions">
              <span class="info-label">地区</span>
              <span class="info-value">{{ movie.regions }}</span>
            </div>
            <div class="info-row" v-if="movie.releaseDate">
              <span class="info-label">上映</span>
              <span class="info-value">{{ formatDate(movie.releaseDate) }}</span>
            </div>
            <div class="info-row" v-if="movie.minutes">
              <span class="info-label">片长</span>
              <span class="info-value">{{ movie.minutes }} 分钟</span>
            </div>
            <div class="info-row" v-if="movie.imdbId">
              <span class="info-label">IMDb</span>
              <span class="info-value">
                <a :href="`https://www.imdb.com/title/${movie.imdbId}`" target="_blank" rel="noopener" class="external-link">
                  {{ movie.imdbId }} ↗
                </a>
              </span>
            </div>
            <div class="info-row" v-if="movie.officialSite">
              <span class="info-label">官网</span>
              <span class="info-value">
                <a :href="movie.officialSite" target="_blank" rel="noopener" class="external-link">
                  访问官网 ↗
                </a>
              </span>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="tags.length" class="tags-cloud">
            <span v-for="tag in tags" :key="tag" class="tag-capsule">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 剧情简介 -->
    <section v-if="movie.description" class="content-section page-container">
      <h2 class="section-title">剧情简介</h2>
      <p class="description-text">{{ movie.description }}</p>
    </section>

    <!-- 演职人员 -->
    <section v-if="directors.length || actors.length" class="content-section page-container">
      <h2 class="section-title">演职人员</h2>
      <div class="cast-scroll">
        <!-- 导演 -->
        <router-link
          v-for="d in directors"
          :key="'d' + d.id"
          :to="`/workers/${d.id}`"
          class="cast-card"
        >
          <div class="cast-avatar" :style="{ background: hashColor(d.id) }">
            {{ getInitial(d.name) }}
          </div>
          <div class="cast-name">{{ d.name }}</div>
          <div class="cast-role">导演</div>
        </router-link>
        <!-- 演员 -->
        <router-link
          v-for="a in actors"
          :key="'a' + a.id"
          :to="`/workers/${a.id}`"
          class="cast-card"
        >
          <div class="cast-avatar" :style="{ background: hashColor(a.id) }">
            {{ getInitial(a.name) }}
          </div>
          <div class="cast-name">{{ a.name }}</div>
          <div class="cast-role">演员</div>
        </router-link>
      </div>
    </section>

    <!-- 用户评论 -->
    <section id="comments-section" class="content-section page-container">
      <h2 class="section-title">用户评论（共 {{ commentTotal }} 条）</h2>

      <div v-if="commentLoading" class="comment-loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="comments.length === 0" class="comment-empty">
        <p class="empty-hint">暂无评论</p>
      </div>

      <div v-else class="comment-list">
        <div v-for="c in comments" :key="c.commentId" class="comment-card">
          <div class="comment-avatar" :style="{ background: hashColor(c.commentId || 0) }">
            {{ c.userNickname ? getInitial(c.userNickname) : '?' }}
          </div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-nick">{{ c.userNickname || '匿名用户' }}</span>
              <StarRating v-if="c.rating" :score="c.rating" :max="5" size="sm" />
            </div>
            <p class="comment-content">{{ c.commentContent }}</p>
            <div class="comment-footer">
              <span class="comment-likes">❤️ {{ c.likeCount || 0 }}</span>
              <span class="comment-time">{{ formatDate(c.commentTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        v-if="commentTotalPages > 1"
        :currentPage="commentPage"
        :totalPages="commentTotalPages"
        :total="commentTotal"
        @update:currentPage="handleCommentPageChange"
      />
    </section>
  </div>
</template>

<style scoped>
/* 加载与错误状态 */
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

.detail-not-found h2 {
  font-size: 22px;
}

.detail-not-found p {
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

/* Hero 区 */
.hero-section {
  position: relative;
  min-height: 480px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(30px) brightness(0.4);
  transform: scale(1.1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 32px;
  padding-top: 40px;
  padding-bottom: 40px;
  align-items: flex-start;
}

.hero-poster {
  flex-shrink: 0;
  width: 240px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

.hero-poster img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  background: #252525;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  opacity: 0.3;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.movie-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 6px;
}

.movie-alias {
  font-size: 15px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

/* 评分 */
.rating-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.rating-score {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-gold);
  line-height: 1;
}

.rating-votes {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* 信息列表 */
.info-list {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}

.info-label {
  flex-shrink: 0;
  width: 50px;
  color: var(--color-text-muted);
  text-align: right;
}

.info-value {
  flex: 1;
  min-width: 0;
}

.worker-link {
  color: var(--color-primary);
  transition: opacity var(--transition);
}

.worker-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.expand-btn {
  color: var(--color-primary);
  font-size: 13px;
  margin-left: 8px;
  text-decoration: underline;
}

.external-link {
  color: var(--color-primary);
  transition: opacity var(--transition);
}

.external-link:hover {
  opacity: 0.8;
}

/* 标签 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

/* 内容区 */
.content-section {
  padding-top: 32px;
  padding-bottom: 16px;
}

.description-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text);
  white-space: pre-wrap;
}

/* 演职人员 */
.cast-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.cast-card {
  flex-shrink: 0;
  width: 90px;
  text-align: center;
  transition: transform var(--transition);
}

.cast-card:hover {
  transform: translateY(-2px);
}

.cast-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.cast-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cast-role {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* 评论 */
.comment-loading {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.comment-empty {
  padding: 40px;
  text-align: center;
}

.empty-hint {
  color: var(--color-text-muted);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
}

.comment-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comment-nick {
  font-weight: 600;
  font-size: 14px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 10px;
  color: var(--color-text);
}

.comment-footer {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hero-poster {
    width: 180px;
  }
  .movie-title {
    font-size: 24px;
  }
  .info-row {
    flex-direction: column;
    gap: 2px;
  }
  .info-label {
    width: auto;
    text-align: left;
  }
  .rating-block {
    margin: 0 auto 20px;
  }
  .tags-cloud {
    justify-content: center;
  }
}
</style>
