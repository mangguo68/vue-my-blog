# Vue 3 个人博客项目

一个现代化、响应式的个人博客系统，基于 Vue 3 + TypeScript + Tailwind CSS 构建，支持深色/浅色模式切换，提供优雅的阅读体验。

## 🎯 项目特点

### 核心功能

- ✨ 响应式设计，适配各种设备尺寸
- 🌙 深色/浅色模式无缝切换
- 📱 现代化 UI 界面，流畅的动画效果
- 🔍 文章搜索功能
- 📁 文章归档与标签分类
- 📚 项目展示与详情页面
- 📊 文章阅读时间统计
- 🎨 渐变色彩主题

### 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS v4 + Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **代码规范**: Prettier

## 🚀 快速开始

### 环境要求

- Node.js ^20.19.0 || >=22.12.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── BlogLayout.vue    # 博客布局组件
│   │   ├── HeaderSearch.vue  # 头部搜索组件
│   │   └── ErrorState.vue    # 错误状态组件
│   ├── composables/     # 组合式函数
│   │   └── useReadingTime.ts # 阅读时间计算
│   ├── data/            # 模拟数据
│   │   ├── articles.ts       # 文章数据
│   │   ├── profile.ts        # 个人资料
│   │   └── projects.ts       # 项目数据
│   ├── router/          # 路由配置
│   ├── services/        # API 服务
│   ├── stores/          # 状态管理
│   │   └── theme.ts          # 主题状态
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   │   ├── HomeView.vue      # 首页
│   │   ├── ArticleView.vue   # 文章详情
│   │   ├── TagsView.vue      # 标签页
│   │   ├── ArchiveView.vue   # 归档页
│   │   ├── ProjectsView.vue  # 项目列表
│   │   ├── ProjectDetailView.vue # 项目详情
│   │   └── AboutView.vue     # 关于页
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共资源
├── dist/                # 构建输出
├── package.json         # 项目配置
└── vite.config.ts       # Vite 配置
```

## 📄 页面说明

### 1. 首页

- 文章列表展示
- 最新文章优先
- 响应式卡片布局
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/7a0e1283-1f2c-4e86-9a71-f085ddf2c020" />

### 2. 文章详情

- 文章内容展示
- 阅读时间统计
- 平滑滚动效果
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/8c771b97-d407-457f-a8c5-d09292cdd96f" />

### 3. 标签页

- 标签云展示
- 按标签筛选文章
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/41d63bb0-82d4-4172-a8fb-fa8fd67c2194" />

### 4. 归档页

- 按时间归档文章
- 年份分组展示
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/6cf84011-48ef-48f0-bbcc-8a284f8aa274" />

### 5. 项目页

- 项目列表展示
- 项目卡片布局
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/677d9cad-b469-4736-93d2-b66ada537170" />

### 6. 项目详情

- 项目详细信息
- 项目截图展示
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/1dffe2c3-a0e6-4c98-9a9c-2c57ef545d39" />

### 7. 关于页

- 个人介绍
- 技术栈展示
<img width="2256" height="1284" alt="image" src="https://github.com/user-attachments/assets/a353d12a-064c-4e52-a3c3-0441f1b5d1a5" />

## 🎨 主题定制

项目支持深色/浅色模式，通过 Pinia 状态管理实现。主题配置位于 `src/stores/theme.ts`。

### 自定义颜色

在 `src/assets/main.css` 中可以修改主题颜色变量：

```css
:root {
  --blog-primary: #3b82f6;
  --blog-secondary: #8b5cf6;
  --blog-accent: #f59e0b;
  /* 其他颜色变量 */
}

.dark {
  --blog-primary: #60a5fa;
  --blog-secondary: #a78bfa;
  --blog-accent: #fbbf24;
  /* 其他深色模式颜色变量 */
}
```

## 🔧 开发指南

### 代码风格

项目使用 Prettier 进行代码格式化，执行以下命令格式化代码：

```bash
npm run format
```

### 类型检查

项目使用 TypeScript，执行以下命令进行类型检查：

```bash
npm run type-check
```

## 📦 部署指南

### Vercel 部署

1. 推送代码到 GitHub 仓库
2. 登录 Vercel 控制台
3. 导入 GitHub 仓库
4. 配置构建命令为 `npm run build`
5. 配置输出目录为 `dist`
6. 点击部署

### Netlify 部署

1. 推送代码到 GitHub 仓库
2. 登录 Netlify 控制台
3. 导入 GitHub 仓库
4. 配置构建命令为 `npm run build`
5. 配置发布目录为 `dist`
6. 点击部署

### 静态网站部署

1. 执行 `npm run build` 生成静态文件
2. 将 `dist` 目录下的文件上传到静态网站托管服务

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系

如果您有任何问题或建议，欢迎联系我！

---

**享受编码的乐趣！** 🎉
