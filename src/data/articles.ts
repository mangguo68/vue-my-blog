import type { Article } from '@/types/blog'

export const articles: Article[] = [
  {
    id: '1',
    title: '欢迎来到我的博客',
    summary: '这是第一篇文章，用来介绍这个博客和写作计划。',
    content: `
      <p>你好，欢迎来到我的个人博客。</p>
      <p>这里会记录一些技术笔记、生活随想，以及我认为值得分享的内容。界面尽量保持简洁，方便阅读。</p>
      <p>技术栈：Vue 3 + TypeScript + Tailwind CSS + Element Plus。</p>
    `,
    date: '2025-02-14',
    tags: ['随笔', '介绍'],
  },
  {
    id: '2',
    title: 'Vue 3 组合式 API 小记',
    summary: '组合式 API 让逻辑复用和代码组织更清晰。',
    content: `
      <p>Vue 3 的 <code>setup</code> 与组合式 API 让相关逻辑可以聚合在一起，而不是按选项（data、methods）分散。</p>
      <p>使用 <code>ref</code>、<code>reactive</code> 管理状态，<code>computed</code>、<code>watch</code> 处理衍生与副作用，结构会更清晰。</p>
      <pre><code>const count = ref(0)\nconst double = computed(() => count.value * 2)</code></pre>
    `,
    date: '2025-02-13',
    tags: ['Vue', '前端'],
  },
  {
    id: '3',
    title: 'Tailwind CSS 快速上手',
    summary: '实用优先的 CSS 框架，写样式更快更一致。',
    content: `
      <p>Tailwind 通过工具类直接写样式，减少起类名和来回切文件的成本。</p>
      <p>配合 <code>@apply</code> 或组件抽离，可以在保持简洁的同时避免重复。响应式与暗色模式也有一致的写法。</p>
    `,
    date: '2025-02-12',
    tags: ['CSS', 'Tailwind'],
  },
  {
    id: '4',
    title: 'TypeScript 在 Vue 中的类型推导',
    summary: '用好 defineProps、defineEmits 与泛型，让组件类型更安全。',
    content: `
      <p>在 <code>&lt;script setup lang="ts"&gt;</code> 里，<code>defineProps</code> 和 <code>defineEmits</code> 可以直接用泛型声明类型，无需 runtime 传参。</p>
      <pre><code>const props = defineProps&lt;{ id: string }&gt;()\nconst emit = defineEmits&lt;{ (e: 'update', v: string): void }&gt;()</code></pre>
      <p>这样模板里的 props 和 emit 都会有完整的类型提示。</p>
    `,
    date: '2025-02-11',
    tags: ['TypeScript', 'Vue', '前端'],
  },
  {
    id: '5',
    title: 'Pinia 状态管理入门',
    summary: 'Vue 官方推荐的状态库，API 简洁、支持 TypeScript。',
    content: `
      <p>Pinia 用 <code>defineStore</code> 定义 store，可以是 setup 写法（组合式）或 options 写法。</p>
      <p>组合式里用 <code>ref</code>、<code>computed</code> 定义状态，直接 return 即可；在组件中 <code>const store = useXxxStore()</code> 就能拿到响应式状态。</p>
    `,
    date: '2025-02-10',
    tags: ['Vue', 'Pinia', '前端'],
  },
  {
    id: '6',
    title: 'Vite 与前端工程化',
    summary: '基于 ESM 的构建工具，开发体验快、配置简单。',
    content: `
      <p>Vite 在开发时利用浏览器原生 ESM，只编译当前用到的模块，所以冷启动和 HMR 都很快。</p>
      <p>生产构建基于 Rollup，支持代码分割、Tree-shaking。和 Vue、React 等框架的官方模板都集成得很好。</p>
    `,
    date: '2025-02-09',
    tags: ['Vite', '前端'],
  },
  {
    id: '7',
    title: '写博客的几点习惯',
    summary: '如何坚持写、写什么、怎么排版，一点个人经验。',
    content: `
      <p>一是定个小目标：比如每周一篇短文，不追求长，先养成习惯。</p>
      <p>二是先写给自己：解决过的问题、踩过的坑，整理成文就是很好的素材。</p>
      <p>三是排版统一：标题层级、代码块、列表格式固定下来，后面维护和迁移都方便。</p>
    `,
    date: '2025-02-08',
    tags: ['随笔', '写作'],
  },
  {
    id: '8',
    title: 'Element Plus 按需引入',
    summary: '用 unplugin-vue-components 实现组件与样式的按需加载。',
    content: `
      <p>在 Vite 中安装 <code>unplugin-vue-components</code> 和 <code>unplugin-auto-import</code>，在 <code>vite.config.ts</code> 里配置 resolver 为 Element Plus。</p>
      <p>这样模板里用到的组件会自动注册，并只打包用到的样式，能明显减小打包体积。</p>
    `,
    date: '2025-02-07',
    tags: ['Element Plus', 'Vue', '前端'],
  },
]

const sortedByDate = [...articles].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function getArticlesSorted(): Article[] {
  return sortedByDate
}

export function getArticlesByTag(tag: string): Article[] {
  return sortedByDate.filter((a) => a.tags.includes(tag))
}

export function getAllTags(): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const a of articles) {
    for (const t of a.tags) {
      map.set(t, (map.get(t) ?? 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getArchiveGroups(): { year: number; months: { month: number; articles: Article[] }[] }[] {
  const byYear = new Map<number, Map<number, Article[]>>()
  for (const a of sortedByDate) {
    const d = new Date(a.date)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    if (!byYear.has(y)) byYear.set(y, new Map())
    const ym = byYear.get(y)!
    if (!ym.has(m)) ym.set(m, [])
    ym.get(m)!.push(a)
  }
  const result: { year: number; months: { month: number; articles: Article[] }[] }[] = []
  for (const [year, monthsMap] of Array.from(byYear.entries()).sort((a, b) => b[0] - a[0])) {
    const months = Array.from(monthsMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([month, articles]) => ({ month, articles }))
    result.push({ year, months })
  }
  return result
}

export function getPrevNext(id: string): { prev: Article | null; next: Article | null } {
  const i = sortedByDate.findIndex((a) => a.id === id)
  if (i < 0) return { prev: null, next: null }
  return {
    prev: i > 0 ? sortedByDate[i - 1]! : null,
    next: i < sortedByDate.length - 1 ? sortedByDate[i + 1]! : null,
  }
}

/** 按关键词搜索：匹配标题、摘要、标签 */
export function searchArticles(keyword: string): Article[] {
  const k = keyword.trim().toLowerCase()
  if (!k) return []
  return sortedByDate.filter(
    (a) =>
      a.title.toLowerCase().includes(k) ||
      a.summary.toLowerCase().includes(k) ||
      a.tags.some((t) => t.toLowerCase().includes(k))
  )
}
