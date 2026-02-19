export interface Project {
  id: string
  name: string
  description: string
  url: string
  repo?: string
  demo?: string
  techs: string[]
  stars?: number
  /** 封面图 URL，不填则用渐变占位 */
  image?: string
  /** 项目创建日期 */
  date?: string
  /** 项目详细描述 */
  details?: string
  /** 项目主要功能列表 */
  features?: string[]
}
