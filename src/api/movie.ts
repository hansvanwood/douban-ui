/**
 * 电影相关 API 接口
 */
import request from './request'

/** 获取电影列表（POST） */
export const fetchMovieList = (params: Record<string, any>) =>
    request.post('/movies/list', params)

/** 获取电影统计数据 */
export const fetchMovieStats = () =>
    request.get('/movies/stats')

/** 获取电影详情 */
export const fetchMovieDetail = (movieId: number | string) =>
    request.get(`/movies/${movieId}`)

/** 获取电影地区列表 */
export const fetchMovieRegions = () =>
    request.get('/movies/regions')

/** 获取电影语言列表 */
export const fetchMovieLanguages = () =>
    request.get('/movies/languages')

/** 获取电影类型列表 */
export const fetchMovieTypes = () =>
    request.get('/movies/types')
