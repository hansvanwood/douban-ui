/**
 * 电影数据 Store
 * 缓存电影列表、筛选参数、分页状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMovieStore = defineStore('movie', () => {
    // 电影列表数据
    const movies = ref<any[]>([])
    const total = ref(0)
    const totalPages = ref(0)
    const loading = ref(false)

    // 当前筛选参数快照（用于判断是否需要重新请求）
    const lastParams = ref<string>('')

    // 统计数据
    const stats = ref<{
        movieCount: number
        commentCount: number
        workerCount: number
    } | null>(null)

    function setMovies(data: any[], totalVal: number, totalPagesVal: number) {
        movies.value = data
        total.value = totalVal
        totalPages.value = totalPagesVal
    }

    function setStats(data: { movieCount: number; commentCount: number; workerCount: number }) {
        stats.value = data
    }

    function setLoading(val: boolean) {
        loading.value = val
    }

    function setLastParams(params: string) {
        lastParams.value = params
    }

    return {
        movies,
        total,
        totalPages,
        loading,
        lastParams,
        stats,
        setMovies,
        setStats,
        setLoading,
        setLastParams
    }
})
