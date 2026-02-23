/**
 * Axios 实例与拦截器配置
 */
import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 创建 Axios 实例
const request = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 15000
})

// 请求拦截器：统一设置请求头
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    (error) => Promise.reject(error)
)

// 响应拦截器：统一处理错误码
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const data = response.data
        // 后端返回 code 500 时跳转错误页
        if (data?.code === 500) {
            window.location.href = '/500'
            return Promise.reject(new Error(data.message || '服务器错误'))
        }
        // 后端返回 code 404 时抛出错误供页面处理
        if (data?.code === 404) {
            const err = new Error(data.message || '资源不存在')
                ; (err as any).code = 404
            return Promise.reject(err)
        }
        return data
    },
    (error) => {
        // 网络错误处理
        if (!error.response) {
            console.error('网络连接失败，请检查后端服务')
        }
        return Promise.reject(error)
    }
)

export default request

export function getPosterUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const baseURL = request.defaults.baseURL;
    return `${baseURL}/poster/${path}`;
}
