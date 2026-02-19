<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Location,
  Link,
  Reading,
  ChatDotRound,
  Document,
  Box,
  ArrowRight,
  User,
  Star,
  Clock,
  Edit,
  Coffee,
  Lightning,
  Trophy,
  RefreshRight,
} from '@element-plus/icons-vue'
import { profileApi } from '@/services'
import type { Profile } from '@/types/profile'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const profile = ref<Profile | null>(null)
const stats = ref({
  articles: 0,
  projects: 0,
  years: 0,
})

// 使用统一的 API 服务加载数据
async function loadData() {
  loading.value = true
  error.value = null
  try {
    // 并行请求用户资料和统计数据
    const [profileRes, statsRes] = await Promise.all([
      profileApi.getProfile(),
      profileApi.getUserStats()
    ])
    
    profile.value = profileRes.data
    stats.value = {
      articles: statsRes.data.totalArticles,
      projects: statsRes.data.totalProjects,
      years: statsRes.data.yearsOfExperience,
    }
  } catch (err) {
    console.error('加载个人信息失败:', err)
    error.value = err instanceof Error ? err.message : '个人信息加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 技能标签
const skills = [
  { name: 'Vue 3', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Tailwind CSS', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'React', level: 75 },
  { name: 'Python', level: 70 },
]

// 时间线数据
const timeline = [
  {
    year: '2024',
    title: '技术博客上线',
    description: '开始记录技术心得和学习笔记，分享开发经验',
    icon: Edit,
  },
  {
    year: '2023',
    title: '全栈开发深入',
    description: '深入学习前后端技术，掌握微服务架构',
    icon: Lightning,
  },
  {
    year: '2022',
    title: '前端技术转型',
    description: '从传统前端转向现代框架，拥抱Vue生态',
    icon: Star,
  },
  {
    year: '2020',
    title: '开启编程之旅',
    description: '正式踏入软件开发领域，从基础开始学习',
    icon: Coffee,
  },
]

function goProjects() {
  router.push('/projects')
}

const socialIcons: Record<string, typeof Link> = {
  github: Link,
  book: Reading,
  chat: ChatDotRound,
}
</script>

<template>
  <!-- 错误状态 -->
  <ErrorState 
    v-if="error && !loading"
    :message="error"
    @retry="loadData"
  />

  <!-- 加载状态 -->
  <div v-else-if="loading" class="w-full max-w-6xl mx-auto flex justify-center items-center py-20">
    <div class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blog-border/20 backdrop-blur-sm">
      <el-icon class="w-5 h-5 text-blog-primary animate-spin">
        <RefreshRight />
      </el-icon>
      <span class="text-sm sm:text-base text-blog-muted">加载个人信息...</span>
    </div>
  </div>

  <div v-else class="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 animate-slide-up">
    <!-- 页面标题 -->
    <div class="text-center mb-10 sm:mb-12 px-4">
      <div class="inline-flex w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary mb-5 sm:mb-6 shadow-lg mx-auto">
        <el-icon class="w-7 h-7 sm:w-8 sm:h-8"><User /></el-icon>
      </div>
      <h1 class="heading-1 text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">关于我</h1>
      <p class="page-section-desc text-base sm:text-xl leading-relaxed">一个热爱技术的开发者，专注于前端工程化和用户体验</p>
    </div>

    <div v-if="profile" class="flex flex-col lg:flex-row lg:gap-8 xl:gap-10">
      <!-- 左侧主要内容 -->
      <div class="flex-1 min-w-0">
        <!-- 个人信息卡片 -->
        <div class="modern-card mb-8 sm:mb-10 shadow-purple">
          <div class="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div class="avatar-ring flex-shrink-0">
              <img
                :src="profile.avatar"
                :alt="profile.name"
                class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/50 dark:border-gray-600 shadow-xl"
              />
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">{{ profile.name }}</h2>
              <p v-if="profile.location" class="inline-flex items-center gap-2 text-blog-muted mb-3 sm:mb-4 text-sm sm:text-base">
                <el-icon class="w-5 h-5 text-blog-primary"><Location /></el-icon>
                {{ profile.location }}
              </p>
              <p class="text-lg text-blog-muted leading-relaxed mb-6">{{ profile.bio }}</p>
              <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  v-for="link in profile.links"
                  :key="link.name"
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blog-primary/10 to-blog-secondary/10 hover:from-blog-primary/20 hover:to-blog-secondary/20 text-blog-primary font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <el-icon class="w-4 h-4"><component :is="socialIcons[link.icon] || Link" /></el-icon>
                  {{ link.name }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能展示 -->
        <div class="modern-card mb-10 shadow-purple">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><Star /></el-icon>
            </span>
            技能专长
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="skill in skills"
              :key="skill.name"
              class="group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ skill.name }}</span>
                <span class="text-sm text-blog-primary font-medium">{{ skill.level }}%</span>
              </div>
              <div class="h-2.5 bg-blog-border/30 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blog-primary to-blog-secondary rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 成就统计 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><Trophy /></el-icon>
            </span>
            成就数据
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-3 group-hover:scale-110 transition-transform duration-300"><Document /></el-icon>
              <div class="text-2xl font-bold text-blog-primary mb-1">{{ stats.articles }}</div>
              <div class="text-sm text-blog-muted">技术文章</div>
            </div>
            <div class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group cursor-pointer" @click="goProjects">
              <el-icon class="w-8 h-8 text-blog-primary mb-3 group-hover:scale-110 transition-transform duration-300"><Box /></el-icon>
              <div class="text-2xl font-bold text-blog-primary mb-1">{{ stats.projects }}</div>
              <div class="text-sm text-blog-muted">开源项目</div>
            </div>
            <div class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-3 group-hover:scale-110 transition-transform duration-300"><Clock /></el-icon>
              <div class="text-2xl font-bold text-blog-primary mb-1">{{ stats.years }}+</div>
              <div class="text-sm text-blog-muted">开发经验</div>
            </div>
            <div class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-3 group-hover:scale-110 transition-transform duration-300"><Coffee /></el-icon>
              <div class="text-2xl font-bold text-blog-primary mb-1">∞</div>
              <div class="text-sm text-blog-muted">学习热情</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧侧边栏 -->
      <aside class="lg:w-96 flex-shrink-0">
        <div class="space-y-8 sticky top-28">
          <!-- 时间线 -->
          <div class="modern-card shadow-purple">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 inline-flex items-center gap-3">
              <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
                <el-icon class="w-5 h-5"><Clock /></el-icon>
              </span>
              成长轨迹
            </h3>
            <div class="space-y-6">
              <div
                v-for="(item, index) in timeline"
                :key="item.year"
                class="relative pl-8 pb-6 last:pb-0 group"
              >
                <!-- 时间线连接线 -->
                <div v-if="index < timeline.length - 1" class="absolute left-4 top-10 w-0.5 h-8 bg-blog-border/30"></div>
                
                <!-- 时间点 -->
                <div class="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blog-primary to-blog-secondary text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <el-icon class="w-4 h-4"><component :is="item.icon" /></el-icon>
                </div>
                
                <!-- 内容 -->
                <div class="bg-blog-border/10 rounded-xl p-4 hover:bg-blog-border/20 transition-all duration-300">
                  <div class="text-sm font-bold text-blog-primary mb-1">{{ item.year }}</div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ item.title }}</h4>
                  <p class="text-sm text-blog-muted">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 关于本站 -->
          <div class="modern-card shadow-purple">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 inline-flex items-center gap-3">
              <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
                <el-icon class="w-5 h-5"><Document /></el-icon>
              </span>
              关于本站
            </h3>
            <div class="space-y-3 text-blog-muted text-sm leading-relaxed">
              <p>✨ 基于 Vue 3 + TypeScript + Tailwind CSS 构建</p>
              <p>🎨 采用现代化紫色主题设计</p>
              <p>📱 完全响应式，支持暗色模式</p>
              <p>⚡ Vite 构建，性能优异</p>
              <p>📝 持续更新技术文章和项目分享</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.avatar-ring {
  position: relative;
}
.avatar-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-blog-primary), #a855f7, #ec4899);
  opacity: 0.6;
  z-index: -1;
  animation: ring-rotate 4s linear infinite;
}
@keyframes ring-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .avatar-ring::before {
    inset: -3px;
  }
}
</style>
