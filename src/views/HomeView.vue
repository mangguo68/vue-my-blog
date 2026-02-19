<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CollectionTag, Document, Calendar, Clock, Star, Promotion, View, HotWater, ArrowRightBold, DataAnalysis, RefreshRight, Warning } from '@element-plus/icons-vue'
import HeroIllustration from '@/components/HeroIllustration.vue'
import ErrorState from '@/components/ErrorState.vue'
import * as api from '@/services'
import { useReadingTime, formatReadingTime } from '@/composables/useReadingTime'
import type { Article } from '@/types/blog'

const router = useRouter()
const route = useRoute()
const list = ref<Article[]>([])
const selectedTag = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// 热门标签（前5个）
const popularTags = ref<Array<{ name: string; count: number }>>([])

// 特色文章（假设前3篇为特色）
const featuredArticles = ref<Article[]>([])

// 统计数据
const stats = ref({
  totalArticles: 0,
  totalTags: 0,
})

const tagFromQuery = computed(() => {
  const t = route.query.tag
  return typeof t === 'string' ? t : null
})
const searchQuery = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q.trim() : ''
})

// 初始化数据
async function initializeData() {
  loading.value = true
  error.value = null
  try {
    // 并行获取多个数据
    const [articlesRes, tagsRes, statsRes] = await Promise.all([
      api.articleApi.getArticles(),
      api.articleApi.getAllTags(),
      api.profileApi.getUserStats()
    ])
    
    // 设置特色文章
    featuredArticles.value = articlesRes.data.slice(0, 3)
    
    // 设置热门标签
    popularTags.value = tagsRes.data
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // 设置统计数据
    stats.value = {
      totalArticles: statsRes.data.totalArticles,
      totalTags: tagsRes.data.length
    }
    
    // 应用查询条件
    applyQueryTag()
  } catch (err) {
    console.error('初始化数据失败:', err)
    error.value = err instanceof Error ? err.message : '数据加载失败'
  } finally {
    loading.value = false
  }
}

function applyQueryTag() {
  selectedTag.value = tagFromQuery.value
  updateList()
}

onMounted(initializeData)
watch(tagFromQuery, applyQueryTag)
watch(searchQuery, applyQueryTag)

async function updateList() {
  loading.value = true
  try {
    const q = searchQuery.value
    if (q) {
      const res = await api.articleApi.searchArticles(q)
      list.value = res.data
      return
    }
    
    const tag = selectedTag.value ?? tagFromQuery.value
    if (tag) {
      const res = await api.articleApi.getArticlesByTag(tag)
      list.value = res.data
    } else {
      const res = await api.articleApi.getArticles()
      list.value = res.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    // 可以在这里添加用户友好的错误提示
    // 例如：ElMessage.error('数据加载失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

function selectTag(tag: string | null) {
  selectedTag.value = tag
  if (tag) {
    router.replace({ query: { ...route.query, tag } })
  } else {
    router.replace({ query: route.query.q ? { q: route.query.q } : {} })
  }
  updateList()
}

function clearFilter() {
  selectedTag.value = null
  router.replace({ query: {} })
  updateList()
}

const recentArticles = computed(() => list.value.slice(0, 5))

function goArticle(id: string) {
  router.push(`/article/${id}`)
}

function goTag(tag: string) {
  selectTag(tag)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function readingTime(article: Article) {
  const min = useReadingTime(article.content)
  return formatReadingTime(min)
}
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:gap-8 xl:gap-10 animate-slide-up">
    <div class="flex-1 min-w-0">
      <!-- Hero区域：仅无筛选时显示 -->
      <div
        v-if="!searchQuery && !selectedTag && !tagFromQuery"
        class="mb-10 sm:mb-12 modern-card bg-gradient-to-br from-blog-card to-blog-primary/5 dark:from-blog-card dark:to-blog-secondary/10 p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 shadow-purple"
      >
        <div class="flex-shrink-0 w-40 h-28 md:w-48 md:h-32">
          <HeroIllustration class="w-full h-full" />
        </div>
        <div class="text-center md:text-left">
          <h1 class="heading-2 text-gray-800 dark:text-gray-100 mb-3">
            欢迎来到我的技术博客
          </h1>
          <p class="page-section-desc text-lg mb-4">
            分享前端技术、编程心得与生活感悟
          </p>
          <div class="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-blog-muted">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blog-primary/10 text-blog-primary">
              <el-icon class="w-4 h-4"><Document /></el-icon>
              {{ stats.totalArticles }} 篇文章
            </span>
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blog-secondary/10 text-blog-secondary">
              <el-icon class="w-4 h-4"><CollectionTag /></el-icon>
              {{ stats.totalTags }} 个标签
            </span>
          </div>
        </div>
      </div>

      <!-- 特色文章推荐 -->
      <div v-if="!searchQuery && !selectedTag && !tagFromQuery" class="mb-10 sm:mb-12">
        <div class="flex items-center gap-3 mb-5 sm:mb-6">
          <span class="flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
            <el-icon class="w-4 h-4 sm:w-5 sm:h-5"><Star /></el-icon>
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">精选推荐</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <article
            v-for="(article, index) in featuredArticles"
            :key="article.id"
            class="modern-card cursor-pointer transition-all duration-300 hover:shadow-purple group animate-fade-in"
            :style="{ animationDelay: `${index * 0.2}s` }"
            @click="goArticle(article.id)"
          >
            <div class="p-6">
              <div class="inline-flex items-center gap-2 text-sm text-blog-primary font-medium mb-3">
                <el-icon class="w-4 h-4"><HotWater /></el-icon>
                精选文章
              </div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blog-primary transition-colors mb-3 line-clamp-2">
                {{ article.title }}
              </h3>
              <p class="text-blog-muted text-sm leading-relaxed mb-4 line-clamp-3">
                {{ article.summary }}
              </p>
              <div class="flex items-center justify-between text-xs text-blog-muted">
                <span class="inline-flex items-center gap-1">
                  <el-icon class="w-3 h-3"><Calendar /></el-icon>
                  {{ formatDate(article.date) }}
                </span>
                <span class="inline-flex items-center gap-1">
                  <el-icon class="w-3 h-3"><View /></el-icon>
                  {{ readingTime(article) }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- 有筛选时的标题区 -->
      <div v-else class="text-center py-6 sm:py-8 mb-6 sm:mb-8">
        <h1 class="heading-2 text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 px-4">
          {{ searchQuery ? `搜索：${searchQuery}` : `标签：${selectedTag || tagFromQuery}` }}
        </h1>
        <p class="page-section-desc mb-3 sm:mb-4 px-4">
          {{ searchQuery ? `共 ${list.length} 篇匹配` : '以下为该标签下的文章' }}
        </p>
        <el-button size="small" @click="clearFilter" round>
          <el-icon class="mr-1"><RefreshRight /></el-icon>
          清除筛选
        </el-button>
      </div>

      <div class="space-y-6">
        <!-- 错误状态 -->
        <ErrorState 
          v-if="error && !loading"
          :message="error"
          @retry="initializeData"
        />
        
        <!-- 加载状态 -->
        <div v-else-if="loading" class="flex justify-center py-12 sm:py-16">
          <div class="inline-flex items-center gap-3 px-5 sm:px-6 py-3 rounded-xl bg-blog-border/20 backdrop-blur-sm">
            <el-icon class="w-5 h-5 text-blog-primary animate-spin">
              <RefreshRight />
            </el-icon>
            <span class="text-sm sm:text-base text-blog-muted">加载中...</span>
          </div>
        </div>
        
        <!-- 文章列表 -->
        <template v-else>
          <article
            v-for="(item, index) in list"
            :key="item.id"
            class="group modern-card cursor-pointer transition-all duration-300 hover:shadow-purple animate-fade-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="goArticle(item.id)"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blog-primary to-blog-accent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div class="p-6">
              <h2 class="heading-3 text-gray-800 dark:text-gray-100 group-hover:text-blog-primary transition-colors mb-3">
                {{ item.title }}
              </h2>
              <p class="text-blog-muted text-base leading-relaxed mb-4 line-clamp-2">
                {{ item.summary }}
              </p>
              <div class="flex flex-wrap items-center gap-4 text-sm text-blog-muted">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blog-border/30">
                  <el-icon class="w-4 h-4 text-blog-primary"><Calendar /></el-icon>
                  {{ formatDate(item.date) }}
                </span>
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blog-border/30">
                  <el-icon class="w-4 h-4 text-blog-primary"><Clock /></el-icon>
                  {{ readingTime(item) }}
                </span>
                <div class="flex flex-wrap gap-2">
                  <el-tag
                    v-for="tag in item.tags"
                    :key="tag"
                    size="small"
                    type="info"
                    effect="plain"
                    class="cursor-pointer transition-all duration-200 hover:scale-105"
                    @click.stop="goTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </article>
        </template>
      </div>
    </div>

    <aside class="lg:w-80 flex-shrink-0 mt-10 lg:mt-0">
      <div class="space-y-8 sticky top-28">
        <!-- 热门标签 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><Promotion /></el-icon>
            </span>
            热门标签
          </h3>
          <div class="space-y-3">
            <button
              v-for="(tag, index) in popularTags"
              :key="tag.name"
              type="button"
              class="w-full flex items-center justify-between p-3 rounded-xl bg-blog-border/20 hover:bg-blog-border/30 transition-all duration-300 group cursor-pointer"
              @click="goTag(tag.name)"
            >
              <div class="flex items-center gap-3">
                <span class="flex w-8 h-8 items-center justify-center rounded-lg text-white font-bold text-sm" :class="[
                  index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                  index === 2 ? 'bg-gradient-to-br from-green-500 to-teal-500' :
                  'bg-gradient-to-br from-blog-primary to-blog-secondary'
                ]">
                  {{ index + 1 }}
                </span>
                <span class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blog-primary transition-colors">
                  {{ tag.name }}
                </span>
              </div>
              <span class="text-sm text-blog-muted font-medium">
                {{ tag.count }}篇
              </span>
            </button>
          </div>
          <button
            type="button"
            class="w-full mt-4 text-sm text-blog-primary hover:text-blog-secondary font-medium inline-flex items-center justify-center gap-2 transition-colors group py-2"
            @click="router.push('/tags')"
          >
            查看全部标签
            <el-icon class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
              <ArrowRightBold />
            </el-icon>
          </button>
        </div>

        <!-- 近期文章 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><Document /></el-icon>
            </span>
            近期更新
          </h3>
          <ul class="space-y-4">
            <li
              v-for="a in recentArticles"
              :key="a.id"
              class="group"
            >
              <button
                type="button"
                class="text-left w-full transition-all duration-200 group-hover:translate-x-1"
                @click="goArticle(a.id)"
              >
                <div class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blog-primary truncate mb-1.5 transition-colors">
                  {{ a.title }}
                </div>
                <div class="flex items-center gap-3 text-xs text-blog-muted">
                  <span class="inline-flex items-center gap-1">
                    <el-icon class="w-3 h-3"><Calendar /></el-icon>
                    {{ formatDate(a.date) }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <el-icon class="w-3 h-3"><View /></el-icon>
                    {{ readingTime(a) }}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <!-- 博客统计 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><DataAnalysis /></el-icon>
            </span>
            博客统计
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blog-border/20 rounded-xl">
              <div class="text-2xl font-bold text-blog-primary mb-1">{{ stats.totalArticles }}</div>
              <div class="text-xs text-blog-muted">文章总数</div>
            </div>
            <div class="text-center p-4 bg-blog-border/20 rounded-xl">
              <div class="text-2xl font-bold text-blog-primary mb-1">{{ stats.totalTags }}</div>
              <div class="text-xs text-blog-muted">标签数量</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
