<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CollectionTag, Document, ArrowRight, RefreshRight, Warning } from '@element-plus/icons-vue'
import ErrorState from '@/components/ErrorState.vue'
import * as api from '@/services'
import type { Article } from '@/types/blog'

const router = useRouter()
const tags = ref<Array<{ name: string; count: number }>>([])
const articlesByTag = ref<Record<string, Article[]>>({})
const loading = ref(false)
const error = ref<string | null>(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = computed(() => {
  return Object.keys(articlesByTag.value).length
})
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value)
})

// 当前页的标签
const currentTags = computed(() => {
  const allTags = Object.keys(articlesByTag.value)
    .map(tagName => ({
      name: tagName,
      count: articlesByTag.value[tagName]?.length || 0,
      articles: articlesByTag.value[tagName] || []
    }))
    .sort((a, b) => b.count - a.count)
  
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return allTags.slice(startIndex, endIndex)
})

const totalArticles = computed(() => {
  return Object.values(articlesByTag.value).reduce((sum, articles) => sum + articles.length, 0)
})

// 初始化数据
async function initializeData() {
  loading.value = true
  error.value = null
  
  try {
    // 并行获取标签和文章数据
    const [tagsRes, articlesRes] = await Promise.all([
      api.articleApi.getAllTags(),
      api.articleApi.getArticles()
    ])
    
    tags.value = tagsRes.data
    
    // 按标签分组文章
    const grouped: Record<string, Article[]> = {}
    articlesRes.data.forEach(article => {
      article.tags.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = []
        }
        grouped[tag].push(article)
      })
    })
    
    articlesByTag.value = grouped
  } catch (err) {
    console.error('初始化标签数据失败:', err)
    error.value = err instanceof Error ? err.message : '标签数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(initializeData)

function goTag(tag: string) {
  router.push({ path: '/', query: { tag } })
}

function goArticle(id: string) {
  router.push(`/article/${id}`)
}

function articlesOf(tagName: string): Article[] {
  return articlesByTag.value[tagName] || []
}

// 分页相关函数
function handlePageChange(page: number) {
  currentPage.value = page
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
}

const MAX_PREVIEW = 5
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:gap-8 animate-slide-up">
    <!-- 主内容区 -->
    <div class="flex-1 min-w-0">
      <!-- 错误状态 -->
      <ErrorState 
        v-if="error && !loading"
        :message="error"
        @retry="initializeData"
      />
      
      <!-- 加载状态 -->
      <div v-else-if="loading" class="flex justify-center py-16">
        <div class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blog-border/20">
          <el-icon class="w-5 h-5 text-blog-primary animate-spin">
            <RefreshRight />
          </el-icon>
          <span class="text-blog-muted">标签数据加载中...</span>
        </div>
      </div>
      
      <!-- 标签内容 -->
      <div v-else>
        <div class="text-center py-12 lg:py-16 mb-12 px-4">
          <div class="inline-flex w-20 h-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary mb-8 shadow-lg mx-auto">
            <el-icon class="w-10 h-10"><CollectionTag /></el-icon>
          </div>
          <h1 class="heading-1 text-gray-800 dark:text-gray-100 mb-6 max-w-4xl mx-auto">
            标签分类
          </h1>
          <p class="page-section-desc text-xl max-w-4xl mx-auto leading-relaxed px-4">
            按标签探索文章内容，点击标签或文章标题即可查看详情
          </p>
          <div class="mt-8 inline-flex flex-wrap items-center justify-center gap-8 text-base text-blog-muted">
            <span class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blog-border/30 backdrop-blur-sm shadow-sm">
              <el-icon class="w-5 h-5 text-blog-primary"><CollectionTag /></el-icon>
              共 {{ tags.length }} 个标签
            </span>
            <span class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blog-border/30 backdrop-blur-sm shadow-sm">
              <el-icon class="w-5 h-5 text-blog-primary"><Document /></el-icon>
              {{ totalArticles }} 篇文章
            </span>
          </div>
        </div>

      <!-- 标签云展示 -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="modern-card shadow-purple">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center inline-flex items-center gap-4">
            <span class="flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-6 h-6"><CollectionTag /></el-icon>
            </span>
            全部标签
          </h2>
          <div class="flex flex-wrap justify-center gap-4">
            <el-tag
              v-for="t in currentTags"
              :key="t.name"
              size="large"
              type="info"
              effect="plain"
              class="cursor-pointer px-5 py-3 text-lg font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg"
              @click="goTag(t.name)"
            >
              {{ t.name }} ({{ t.count }})
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 标签文章列表 -->
      <div class="max-w-4xl mx-auto space-y-8">
        <section
          v-for="(t, index) in currentTags"
          :key="t.name"
          class="modern-card animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="px-6 py-5 border-b border-blog-border/50 bg-gradient-to-r from-blog-primary/5 to-transparent rounded-t-2xl">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blog-primary transition-colors group"
                @click="goTag(t.name)"
              >
                <el-icon class="w-6 h-6 text-blog-primary group-hover:scale-110 transition-transform duration-300">
                  <CollectionTag />
                </el-icon>
                {{ t.name }}
              </button>
              <span class="px-3 py-1 rounded-full bg-blog-primary/10 text-blog-primary text-sm font-medium">
                {{ t.count }} 篇文章
              </span>
            </div>
          </div>
          
          <ul class="divide-y divide-blog-border/30">
            <li
              v-for="a in articlesOf(t.name).slice(0, MAX_PREVIEW)"
              :key="a.id"
              class="group"
            >
              <button
                type="button"
                class="w-full px-6 py-4 text-left flex items-center justify-between gap-3 hover:bg-blog-primary/5 dark:hover:bg-blog-primary/10 transition-all duration-300 group-hover:translate-x-1"
                @click="goArticle(a.id)"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blog-primary truncate transition-colors">
                    {{ a.title }}
                  </div>
                  <div class="text-sm text-blog-muted mt-1 truncate">
                    {{ a.summary }}
                  </div>
                </div>
                <el-icon class="w-5 h-5 text-blog-muted flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight />
                </el-icon>
              </button>
            </li>
          </ul>
          
          <div v-if="articlesOf(t.name).length > MAX_PREVIEW" class="px-6 py-4 border-t border-blog-border/30 text-center bg-blog-bg/20 rounded-b-2xl">
            <span class="text-sm text-blog-muted">
              该标签下共 {{ articlesOf(t.name).length }} 篇文章
            </span>
          </div>
          
          <div class="px-6 py-4 bg-gradient-to-r from-blog-bg/50 to-blog-bg/30 border-t border-blog-border/30 rounded-b-2xl">
            <button
              type="button"
              class="w-full text-sm text-blog-primary hover:text-blog-secondary font-medium inline-flex items-center justify-center gap-2 transition-colors group"
              @click="goTag(t.name)"
            >
              查看该标签下全部文章
              <el-icon class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight />
              </el-icon>
            </button>
          </div>
        </section>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12 mb-8">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="totalItems"
            layout="prev, pager, next, sizes, ->, total"
            background
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
    </div>
    
    <!-- 侧边栏 -->
    <aside class="lg:w-80 flex-shrink-0 mt-12 lg:mt-0">
      <div class="space-y-8 sticky top-28">
        <!-- 热门标签排行 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><CollectionTag /></el-icon>
            </span>
            热门标签排行
          </h3>
          <div class="space-y-3">
            <div
              v-for="(t, index) in currentTags.slice(0, 8)"
              :key="t.name"
              class="flex items-center justify-between p-3 rounded-xl bg-blog-border/20 hover:bg-blog-border/30 transition-all duration-300 group cursor-pointer"
              @click="goTag(t.name)"
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
                  {{ t.name }}
                </span>
              </div>
              <span class="text-sm text-blog-muted font-medium">
                {{ t.count }}篇
              </span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5"><Document /></el-icon>
            </span>
            内容统计
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blog-border/20 rounded-xl">
              <div class="text-2xl font-bold text-blog-primary">{{ tags.length }}</div>
              <div class="text-xs text-blog-muted mt-1">标签总数</div>
            </div>
            <div class="text-center p-4 bg-blog-border/20 rounded-xl">
              <div class="text-2xl font-bold text-blog-primary">{{ totalArticles }}</div>
              <div class="text-xs text-blog-muted mt-1">文章总数</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
