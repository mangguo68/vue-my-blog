/**
 * 文章相关API服务
 */
import { articles } from '@/data/articles'
import type { Article } from '@/types/blog'
import { mockRequest, createApiResponse, type ApiResponse, type PaginationResult } from './api'

/**
 * 获取文章列表
 */
export async function getArticles(): Promise<ApiResponse<Article[]>> {
  const data = await mockRequest([...articles])
  return createApiResponse(data)
}

/**
 * 分页获取文章列表
 */
export async function getArticlesPaginated(
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PaginationResult<Article>>> {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const data = await mockRequest([...articles])
  
  const result: PaginationResult<Article> = {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize)
  }
  
  return createApiResponse(result)
}

/**
 * 根据ID获取文章详情
 */
export async function getArticleById(id: string): Promise<ApiResponse<Article | null>> {
  const data = await mockRequest(articles.find(article => article.id === id) || null)
  return createApiResponse(data)
}

/**
 * 根据标签获取文章
 */
export async function getArticlesByTag(tag: string): Promise<ApiResponse<Article[]>> {
  const data = await mockRequest(
    articles.filter(article => article.tags.includes(tag))
  )
  return createApiResponse(data)
}

/**
 * 搜索文章
 */
export async function searchArticles(keyword: string): Promise<ApiResponse<Article[]>> {
  const lowerKeyword = keyword.toLowerCase()
  const data = await mockRequest(
    articles.filter(article => 
      article.title.toLowerCase().includes(lowerKeyword) ||
      article.summary.toLowerCase().includes(lowerKeyword) ||
      article.content.toLowerCase().includes(lowerKeyword) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  )
  return createApiResponse(data)
}

/**
 * 获取所有标签及其文章数量
 */
export async function getAllTags(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
  const tagMap = new Map<string, number>()
  
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  const data = await mockRequest(
    Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }))
  )
  
  return createApiResponse(data)
}

/**
 * 获取按年月分组的文章归档
 */
export async function getArchiveGroups(): Promise<ApiResponse<any[]>> {
  const groups: Record<string, any> = {}
  
  articles.forEach(article => {
    const date = new Date(article.date)
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1
    
    if (!groups[year]) {
      groups[year] = { year, months: {} }
    }
    
    const monthKey = `${year}-${month}`
    if (!groups[year].months[monthKey]) {
      groups[year].months[monthKey] = { month, articles: [] }
    }
    
    groups[year].months[monthKey].articles.push(article)
  })
  
  // 转换为数组并排序
  const result = Object.values(groups).map((group: any) => ({
    ...group,
    months: Object.values(group.months)
      .sort((a: any, b: any) => b.month - a.month)
  })).sort((a: any, b: any) => parseInt(b.year) - parseInt(a.year))
  
  const data = await mockRequest(result)
  return createApiResponse(data)
}

/**
 * 获取最新文章
 */
export async function getRecentArticles(limit: number = 5): Promise<ApiResponse<Article[]>> {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const data = await mockRequest(sortedArticles.slice(0, limit))
  return createApiResponse(data)
}