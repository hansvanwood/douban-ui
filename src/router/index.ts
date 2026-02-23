/**
 * 路由配置
 * 全部视图组件使用懒加载
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/movies',
            name: 'MovieList',
            component: () => import('@/views/MovieListView.vue')
        },
        {
            path: '/movies/:movieId',
            name: 'MovieDetail',
            component: () => import('@/views/MovieDetailView.vue')
        },
        {
            path: '/workers/:workerId',
            name: 'WorkerDetail',
            component: () => import('@/views/WorkerDetailView.vue')
        },
        {
            path: '/500',
            name: 'Error',
            component: () => import('@/views/ErrorView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFoundView.vue')
        }
    ]
})

export default router
