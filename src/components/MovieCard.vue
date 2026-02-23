<script setup lang="ts">
import { ref, computed } from 'vue'
import { getPosterUrl } from '@/api/request'

const props = defineProps<{
  movie: any
}>()

const imgError = ref(false)

// 电影海报 URL
const posterUrl = computed(() => {
  if (!props.movie?.cover || imgError.value) return ''
  return getPosterUrl(props.movie.cover)
})

// 主演（最多3人）
const actors = computed(() => {
  if (!props.movie?.actors) return ''
  return props.movie.actors
    .split('/')
    .slice(0, 3)
    .map((s: string) => s.trim())
    .join(' / ')
})

// 类型标签
const types = computed(() => {
  if (!props.movie?.type) return []
  return props.movie.type.split('/').map((g: string) => g.trim()).filter(Boolean)
})

const onImgError = () => {
  imgError.value = true
}
</script>

<template>
  <router-link :to="`/movies/${movie.movieId}`" class="movie-card">
    <div class="card-poster">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="movie.movieName"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="poster-placeholder">
        <span class="placeholder-icon">🎬</span>
      </div>
      <!-- 右上角评分 -->
      <div v-if="movie.doubanScore" class="card-score">
        <span class="score-star">⭐</span>
        <span class="score-value">{{ movie.doubanScore }}</span>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title" :title="movie.movieName">{{ movie.movieName }}</h3>
      <p v-if="actors" class="card-actors">{{ actors }}</p>
      <div class="card-meta">
        <div v-if="types.length" class="card-types">
          <span v-for="g in types.slice(0, 2)" :key="g" class="tag-capsule">{{ g }}</span>
        </div>
        <span v-if="movie.year" class="card-year">{{ movie.year }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.movie-card {
  display: block;
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
  box-shadow: var(--shadow-card);
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.card-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: #252525;
}

.card-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition);
}

.movie-card:hover .card-poster img {
  transform: scale(1.03);
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #252525, #1a1a1a);
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.3;
}

.card-score {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 3px;
}

.score-star {
  font-size: 11px;
}

.score-value {
  color: var(--color-gold);
  font-weight: 700;
  font-size: 13px;
}

.card-info {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}

.card-actors {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-types {
  display: flex;
  gap: 4px;
  overflow: hidden;
}

.card-types .tag-capsule {
  font-size: 11px;
  padding: 1px 7px;
}

.card-year {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
}
</style>
