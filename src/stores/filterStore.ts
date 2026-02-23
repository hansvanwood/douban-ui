/**
 * 筛选条件 Store
 * 缓存枚举数据（类型/地区/语言），只请求一次
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMovieTypes, fetchMovieRegions, fetchMovieLanguages } from '@/api/movie'

export const useFilterStore = defineStore('filter', () => {
    const types = ref<string[]>([])
    const regions = ref<string[]>([])
    const languages = ref<string[]>([])
    const loaded = ref(false)

    async function loadFilters() {
        if (loaded.value) return
        try {
            const [typesRes, regionsRes, languagesRes] = await Promise.all([
                fetchMovieTypes(),
                fetchMovieRegions(),
                fetchMovieLanguages()
            ])
            types.value = (typesRes as any)?.data || []
            regions.value = (regionsRes as any)?.data || []
            languages.value = (languagesRes as any)?.data || []
            loaded.value = true
        } catch (e) {
            console.error('加载筛选条件失败', e)
        }
    }

    return {
        types,
        regions,
        languages,
        loaded,
        loadFilters
    }
})
