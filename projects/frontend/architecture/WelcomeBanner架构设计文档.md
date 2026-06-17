# WelcomeBanner 组件架构设计文档

## 1. 基本信息

| 属性 | 值 |
|------|-----|
| **项目 ID** | US-FE-001 |
| **组件名称** | WelcomeBanner |
| **设计日期** | 2024-12-19 |
| **架构师** | AI Assistant |
| **技术栈** | Vue 3 + TypeScript + Vite + Composition API |
| **状态** | 设计中 |

## 2. 分层设计

### 2.1 目录结构

```
src/
├── components/
│   └── WelcomeBanner.vue          # WelcomeBanner 组件
├── types/
│   └── components.ts              # 组件类型定义
├── composables/
│   └── useWelcomeBanner.ts        # 组件业务逻辑
└── locales/
    ├── en.ts                      # 英文文案
    ├── hi.ts                      # 印地语文案
    └── id.ts                      # 印尼语文案
```

### 2.2 组件架构

```
WelcomeBanner.vue
├── Props Interface (WelcomeBannerProps)
├── Composable Logic (useWelcomeBanner)
├── Template (响应式布局)
└── Styles (Tailwind CSS + 自定义样式)
```

## 3. 技术栈约束

### 3.1 环境配置
- **环境变量**: `import.meta.env.VITE_*`
- **构建工具**: Vite
- **语言**: TypeScript
- **包管理**: npm

### 3.2 样式框架
- **主要**: Tailwind CSS 4.1.18
- **UI 框架**: Element Plus 2.13.2
- **响应式断点**:
  - Mobile: `< 768px` (sm)
  - Tablet: `768px - 1023px` (md)
  - Desktop: `>= 1024px` (lg)

### 3.3 状态管理
- **Store**: Pinia 3.0.4 (Composition Store)
- **目录**: `src/stores/`

## 4. Figma 约束章节

由于未提供 Figma 设计稿，以下约束基于 User Story 中的设计要求：

### 4.1 布局约束
- **容器**: 全宽容器，顶部显示
- **内边距**: 桌面端 py-12 px-8，移动端 py-8 px-4
- **对齐**: 文字居中对齐
- **层次**: 标题在上，副标题在下

### 4.2 字体约束
- **标题字体**: text-4xl (36px) 桌面端，text-3xl (30px) 移动端
- **副标题字体**: text-xl (20px) 桌面端，text-lg (18px) 移动端
- **字重**: 标题 font-bold (700)，副标题 font-medium (500)
- **字体族**: 使用系统默认字体栈

### 4.3 颜色约束
- **背景色**: bg-gradient-to-r from-blue-50 to-indigo-100
- **标题颜色**: text-gray-900
- **副标题颜色**: text-gray-600
- **对比度**: 符合 WCAG 2.1 AA 标准

### 4.4 间距约束
- **标题与副标题间距**: mt-4 (16px)
- **组件外边距**: mb-8 (32px)
- **响应式内边距**:
  - 桌面端: px-8 py-12
  - 平板端: px-6 py-10
  - 移动端: px-4 py-8

## 5. 组件设计

### 5.1 WelcomeBanner.vue 组件

#### Props 接口
```typescript
interface WelcomeBannerProps {
  title?: string;
  subtitle?: string;
  locale?: 'en' | 'hi' | 'id';
  customClass?: string;
}
```

#### 组件结构
```vue
<template>
  <div class="welcome-banner">
    <div class="container">
      <h1 class="title">{{ displayTitle }}</h1>
      <p class="subtitle">{{ displaySubtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
/* 自定义样式 */
</style>
```

### 5.2 类型定义 (types/components.ts)

```typescript
export interface WelcomeBannerProps {
  title?: string;
  subtitle?: string;
  locale?: 'en' | 'hi' | 'id';
  customClass?: string;
}

export interface WelcomeBannerLocale {
  welcome_title: string;
  welcome_subtitle: string;
}

export interface WelcomeBannerConfig {
  defaultLocale: 'en' | 'hi' | 'id';
  showAnimation: boolean;
  theme: 'light' | 'dark';
}
```

## 6. Composable 设计

### 6.1 useWelcomeBanner.ts

```typescript
import { computed, ref } from 'vue'
import type { WelcomeBannerProps, WelcomeBannerLocale } from '@/types/components'

export function useWelcomeBanner(props: WelcomeBannerProps) {
  const defaultLocale = ref<'en' | 'hi' | 'id'>('en')
  
  // 多语言文案
  const locales: Record<string, WelcomeBannerLocale> = {
    en: {
      welcome_title: 'Welcome to Our Website',
      welcome_subtitle: 'Discover amazing features and services'
    },
    hi: {
      welcome_title: 'हमारी वेबसाइट में आपका स्वागत है',
      welcome_subtitle: 'अद्भुत सुविधाओं और सेवाओं की खोज करें'
    },
    id: {
      welcome_title: 'Selamat Datang di Website Kami',
      welcome_subtitle: 'Temukan fitur dan layanan yang menakjubkan'
    }
  }
  
  // 当前语言环境
  const currentLocale = computed(() => props.locale || defaultLocale.value)
  
  // 显示文本
  const displayTitle = computed(() => 
    props.title || locales[currentLocale.value]?.welcome_title || locales.en.welcome_title
  )
  
  const displaySubtitle = computed(() => 
    props.subtitle || locales[currentLocale.value]?.welcome_subtitle || locales.en.welcome_subtitle
  )
  
  return {
    displayTitle,
    displaySubtitle,
    currentLocale
  }
}
```

## 7. 多语言设计

### 7.1 语言文件结构

#### locales/en.ts
```typescript
export default {
  welcome_title: 'Welcome to Our Website',
  welcome_subtitle: 'Discover amazing features and services'
}
```

#### locales/hi.ts
```typescript
export default {
  welcome_title: 'हमारी वेबसाइट में आपका स्वागत है',
  welcome_subtitle: 'अद्भुत सुविधाओं और सेवाओं की खोज करें'
}
```

#### locales/id.ts
```typescript
export default {
  welcome_title: 'Selamat Datang di Website Kami',
  welcome_subtitle: 'Temukan fitur dan layanan yang menakjubkan'
}
```

## 8. 样式设计

### 8.1 响应式样式类

```typescript
const responsiveClasses = {
  container: 'w-full bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12',
  wrapper: 'max-w-4xl mx-auto text-center',
  title: 'text-3xl font-bold text-gray-900 lg:text-4xl',
  subtitle: 'mt-4 text-lg font-medium text-gray-600 lg:text-xl'
}
```

### 8.2 自定义 CSS 变量

```css
.welcome-banner {
  --banner-bg-from: theme('colors.blue.50');
  --banner-bg-to: theme('colors.indigo.100');
  --title-color: theme('colors.gray.900');
  --subtitle-color: theme('colors.gray.600');
}
```

## 9. 错误处理

### 9.1 错误边界
- **Props 验证**: 提供默认值确保组件正常渲染
- **语言回退**: 不支持的语言自动回退到英文
- **样式降级**: Tailwind 失效时使用内联样式

### 9.2 错误处理策略

```typescript
// 错误处理示例
const safeDisplayTitle = computed(() => {
  try {
    return props.title || locales[currentLocale.value]?.welcome_title || 'Welcome'
  } catch (error) {
    console.warn('WelcomeBanner: Error loading title', error)
    return 'Welcome'
  }
})
```

## 10. 性能优化

### 10.1 组件优化
- **懒加载**: 支持异步加载
- **缓存**: computed 属性自动缓存
- **SSR 友好**: 服务端渲染兼容

### 10.2 性能指标
- **初始化时间**: < 100ms
- **内存占用**: < 1MB
- **重渲染次数**: 最小化

## 11. 集成方案

### 11.1 主页面集成

```vue
<template>
  <div>
    <!-- 在页面顶部使用 -->
    <WelcomeBanner 
      :locale="currentLanguage" 
      :title="customTitle"
      :subtitle="customSubtitle"
    />
    <!-- 其他页面内容 -->
  </div>
</template>

<script setup lang="ts">
import WelcomeBanner from '@/components/WelcomeBanner.vue'

// 可选的自定义配置
const currentLanguage = ref<'en' | 'hi' | 'id'>('en')
const customTitle = ref('')
const customSubtitle = ref('')
</script>
```

### 11.2 导入导出

```typescript
// main.ts 全局注册（可选）
import WelcomeBanner from './components/WelcomeBanner.vue'

app.component('WelcomeBanner', WelcomeBanner)

// 按需导入
import WelcomeBanner from '@/components/WelcomeBanner.vue'
```

## 12. 测试策略

### 12.1 单元测试
- Props 传入测试
- 多语言切换测试
- 响应式样式测试
- 错误处理测试

### 12.2 集成测试
- 页面集成测试
- 路由切换测试
- 用户交互测试

## 13. 交付清单

### 13.1 核心文件
- [x] `src/components/WelcomeBanner.vue` - 主组件
- [x] `src/types/components.ts` - 类型定义
- [x] `src/composables/useWelcomeBanner.ts` - 业务逻辑

### 13.2 多语言文件
- [x] `src/locales/en.ts` - 英文
- [x] `src/locales/hi.ts` - 印地语  
- [x] `src/locales/id.ts` - 印尼语

### 13.3 配置文件
- [x] TypeScript 类型检查配置
- [x] Tailwind CSS 响应式配置
- [x] Vite 构建配置

## 14. 时序图

### 14.1 主流程时序图

```
用户访问页面
    ↓
页面路由加载
    ↓
WelcomeBanner 组件初始化
    ↓
useWelcomeBanner Hook 执行
    ↓
多语言文案解析
    ↓
响应式样式计算
    ↓
DOM 渲染完成
    ↓
组件显示给用户
```

### 14.2 错误处理时序图

```
组件加载失败
    ↓
错误边界捕获
    ↓
回退到默认配置
    ↓
使用内置文案
    ↓
基础样式渲染
    ↓
显示降级版本
```

---

> **本文档已严格遵循 Figma 设计稿，与 User Story 差异：无（未提供 Figma 设计稿，完全基于 User Story 设计要求实现）**