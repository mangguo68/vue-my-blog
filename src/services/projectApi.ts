/**
 * 项目相关API服务
 */
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { mockRequest, createApiResponse, type ApiResponse, type PaginationResult } from './api'

/**
 * 获取项目列表
 */
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const data = await mockRequest([...projects])
  return createApiResponse(data)
}

/**
 * 分页获取项目列表
 */
export async function getProjectsPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<ApiResponse<PaginationResult<Project>>> {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const data = await mockRequest([...projects])
  
  const result: PaginationResult<Project> = {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize)
  }
  
  return createApiResponse(result)
}

/**
 * 根据ID获取项目详情
 */
export async function getProjectById(id: string): Promise<ApiResponse<Project | null>> {
  const data = await mockRequest(projects.find(project => project.id === id) || null)
  return createApiResponse(data)
}

/**
 * 根据技术栈筛选项目
 */
export async function getProjectsByTech(tech: string): Promise<ApiResponse<Project[]>> {
  const data = await mockRequest(
    projects.filter(project => 
      project.techs.some(t => t.toLowerCase().includes(tech.toLowerCase()))
    )
  )
  return createApiResponse(data)
}

/**
 * 搜索项目
 */
export async function searchProjects(keyword: string): Promise<ApiResponse<Project[]>> {
  const lowerKeyword = keyword.toLowerCase()
  const data = await mockRequest(
    projects.filter(project => 
      project.name.toLowerCase().includes(lowerKeyword) ||
      project.description.toLowerCase().includes(lowerKeyword) ||
      project.techs.some(tech => tech.toLowerCase().includes(lowerKeyword))
    )
  )
  return createApiResponse(data)
}

/**
 * 获取热门项目（按stars排序）
 */
export async function getPopularProjects(limit: number = 3): Promise<ApiResponse<Project[]>> {
  const sortedProjects = [...projects].sort((a, b) => (b.stars || 0) - (a.stars || 0))
  const data = await mockRequest(sortedProjects.slice(0, limit))
  return createApiResponse(data)
}

/**
 * 获取项目统计信息
 */
export async function getProjectsStats(): Promise<ApiResponse<{
  totalProjects: number
  totalStars: number
  techDistribution: Array<{ tech: string; count: number }>
}>> {
  const totalStars = projects.reduce((sum, project) => sum + (project.stars || 0), 0)
  
  // 计算技术栈分布
  const techMap = new Map<string, number>()
  projects.forEach(project => {
    project.techs.forEach(tech => {
      techMap.set(tech, (techMap.get(tech) || 0) + 1)
    })
  })
  
  const techDistribution = Array.from(techMap.entries())
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count)
  
  const data = await mockRequest({
    totalProjects: projects.length,
    totalStars,
    techDistribution
  })
  
  return createApiResponse(data)
}