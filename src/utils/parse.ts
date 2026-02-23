/**
 * 工具函数模块
 * 包含演职人员解析、颜色哈希、日期格式化等通用方法
 */

/** 演职人员信息 */
export interface WorkerInfo {
    name: string
    id: number
}

/** 预设颜色组 */
const COLORS = ['#60A84E', '#4a90d9', '#e67e22', '#9b59b6', '#e74c3c', '#1abc9c', '#f39c12', '#2980b9']

/**
 * 解析 actorIds / directorIds 字段
 * 格式："姓名:id|姓名:id" → [{name, id}]
 */
export function parseWorkerIds(str: string | null | undefined): WorkerInfo[] {
    if (!str) return []
    return str.split('|').map(item => {
        const [name, id] = item.split(':')
        return { name: name?.trim() || '', id: Number(id) || 0 }
    }).filter(w => w.name && w.id)
}

/**
 * 根据 ID 哈希获取预设颜色
 */
export function hashColor(id: number | string): string {
    return COLORS[Number(id) % COLORS.length]!
}

/**
 * 格式化日期（去掉时分秒，只保留 yyyy-MM-dd）
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return ''
    return dateStr.slice(0, 10)
}

/**
 * 获取名字首字（中文取第一个字，英文取首字母大写）
 */
export function getInitial(name: string): string {
    if (!name) return '?'
    const first = name.charAt(0)
    // 判断是否为 ASCII 字母
    if (/[a-zA-Z]/.test(first)) {
        return first.toUpperCase()
    }
    return first
}
