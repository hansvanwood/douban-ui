/**
 * 评论相关 API 接口
 */
import request from './request'

/** 获取电影评论列表 */
export const fetchComments = (movieId: number | string, pageNum: number = 1, pageSize: number = 20) =>
    request.get(`/comments/${movieId}`, { params: { pageNum, pageSize } })
