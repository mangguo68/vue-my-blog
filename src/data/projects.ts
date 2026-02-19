import type { Project } from '@/types/project'
import { getImageUrl } from '@/utils/image'

export const projects: Project[] = [
  {
    id: '1',
    name: 'vue3-my-blog-projects',
    description: '基于 Vue 3 + TypeScript + Tailwind + Element Plus 的个人博客模板，支持暗色模式、标签归档与搜索。',
    url: '#',
    repo: 'https://github.com',
    demo: 'https://demo.example.com',
    techs: ['Vue 3', 'TypeScript', 'Tailwind', 'Element Plus'],
    stars: 128,
    image: getImageUrl(1),
    date: '2024-01-15',
    details: '这是一个现代化的个人博客系统，采用最新的前端技术栈构建。系统具有响应式设计，支持深色模式切换，提供完整的文章管理、标签分类、归档浏览等功能。',
    features: [
      '响应式设计，支持移动端访问',
      '深色模式自动切换',
      '文章标签分类管理',
      '全文搜索功能',
      '现代化UI设计',
      'SEO友好',
      'PWA支持'
    ]
  },
  {
    id: '2',
    name: 'mini-utils',
    description: '日常开发中整理的 JavaScript/TypeScript 工具函数库，零依赖、Tree-shaking 友好。',
    url: '#',
    repo: 'https://github.com',
    demo: 'https://npmjs.com/package/mini-utils',
    techs: ['TypeScript', 'ESM'],
    stars: 56,
    image: getImageUrl(2),
    date: '2023-11-20',
    details: '一个轻量级的工具函数库，专注于提供常用的JavaScript工具函数。采用TypeScript编写，支持Tree-shaking，可以按需引入所需功能，避免打包体积膨胀。',
    features: [
      '零依赖设计',
      '支持Tree-shaking',
      'TypeScript类型支持',
      'ES Modules导出',
      '详尽的文档说明',
      '完善的单元测试'
    ]
  },
  {
    id: '3',
    name: 'cli-tool-template',
    description: '基于 Node 的 CLI 脚手架模板，支持交互式命令与插件扩展。',
    url: '#',
    repo: 'https://github.com',
    demo: 'https://cli-demo.example.com',
    techs: ['Node', 'TypeScript', 'Commander'],
    stars: 42,
    image: getImageUrl(3),
    date: '2023-09-10',
    details: '一款功能强大的CLI脚手架工具，支持交互式命令行界面和插件扩展机制。可以帮助开发者快速搭建项目模板，提高开发效率。',
    features: [
      '交互式命令行界面',
      '插件扩展机制',
      '模板定制化',
      '多项目类型支持',
      '配置文件生成',
      '自动化部署'
    ]
  },
  {
    id: '4',
    name: 'component-lib',
    description: '内部使用的 Vue 3 组件库，按需引入，与设计规范统一。',
    url: '#',
    repo: 'https://github.com',
    demo: 'https://components.example.com',
    techs: ['Vue 3', 'Vite', 'Vitest'],
    stars: 89,
    image: getImageUrl(4),
    date: '2023-12-05',
    details: '一套企业级Vue 3组件库，遵循统一的设计规范，支持按需引入。包含丰富的业务组件和完善的文档体系，提升团队开发效率。',
    features: [
      '按需引入，零配置',
      '统一设计规范',
      'TypeScript支持',
      '完善的测试覆盖',
      '国际化支持',
      '主题定制能力'
    ]
  },
]
