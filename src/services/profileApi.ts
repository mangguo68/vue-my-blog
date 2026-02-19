/**
 * 用户资料相关API服务
 */
import { profile } from '@/data/profile'
import type { Profile } from '@/types/profile'
import { mockRequest, createApiResponse, type ApiResponse } from './api'

/**
 * 获取用户资料
 */
export async function getProfile(): Promise<ApiResponse<Profile>> {
  const data = await mockRequest({ ...profile })
  return createApiResponse(data)
}

/**
 * 更新用户资料
 */
export async function updateProfile(updatedProfile: Partial<Profile>): Promise<ApiResponse<Profile>> {
  // 在实际应用中这里会发送PUT请求
  // 目前只是模拟更新操作
  const data = await mockRequest({
    ...profile,
    ...updatedProfile
  })
  return createApiResponse(data)
}

/**
 * 获取用户统计数据
 */
export async function getUserStats(): Promise<ApiResponse<{
  totalArticles: number
  totalProjects: number
  yearsOfExperience: number
  totalWords: number
}>> {
  // 导入必要的数据
  const { articles } = await import('@/data/articles')
  const { projects } = await import('@/data/projects')
  
  // 计算统计数据
  const totalWords = articles.reduce((sum, article) => {
    const wordCount = article.content.replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .length
    return sum + wordCount
  }, 0)
  
  const data = await mockRequest({
    totalArticles: articles.length,
    totalProjects: projects.length,
    yearsOfExperience: new Date().getFullYear() - 2020,
    totalWords
  })
  
  return createApiResponse(data)
}