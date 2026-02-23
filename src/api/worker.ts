/**
 * 电影人相关 API 接口
 */
import request from './request'

/** 获取电影人详情 */
export const fetchWorkerDetail = (workerId: number | string) =>
    request.get(`/workers/${workerId}`)
