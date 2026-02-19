/**
 * 模拟API服务
 * 提供类似真实API的异步数据获取接口
 */

// 模拟延迟时间（毫秒）
const MOCK_DELAY = 800

// 模拟网络错误概率（0-1之间）
const ERROR_RATE = 0.05

/**
 * 模拟网络请求延迟
 */
function mockDelay(): Promise<void> {
  // 随机延迟 500-1200ms，更贴近真实网络环境
  const delay = Math.random() * 700 + 500
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

/**
 * 模拟网络错误
 */
function mockError(): boolean {
  return Math.random() < ERROR_RATE
}

/**
 * 包装数据请求，添加延迟和错误模拟
 */
async function mockRequest<T>(data: T): Promise<T> {
  await mockDelay()
  
  if (mockError()) {
    throw new Error('网络请求失败，请稍后重试')
  }
  
  return data
}

/**
 * 分页结果类型
 */
export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * API响应包装类型
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * 创建标准API响应
 */
function createApiResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
    timestamp: Date.now()
  }
}

export { mockRequest, createApiResponse }