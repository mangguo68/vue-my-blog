<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Clock, Calendar, RefreshRight } from '@element-plus/icons-vue'
import { articleApi } from '@/services'
import { getPrevNext } from '@/data/articles'
import { useReadingTime, formatReadingTime } from '@/composables/useReadingTime'
import type { Article } from '@/types/blog'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const article = ref<Article | null>(null)

const prevNext = computed(() =>
  article.value ? getPrevNext(article.value.id) : { prev: null, next: null }
)
const readingTimeText = computed(() =>
  article.value ? formatReadingTime(useReadingTime(article.value.content)) : ''
)

// 加载文章数据
async function loadArticle(id: string) {
  loading.value = true
  error.value = null
  try {
    const response = await articleApi.getArticleById(id)
    article.value = response.data
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = err instanceof Error ? err.message : '文章加载失败'
    article.value = null
  } finally {
    loading.value = false
  }
}

// 初始加载
onMounted(() => {
  loadArticle(route.params.id as string)
})

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadArticle(newId as string)
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function goBack() {
  router.push('/')
}
function goArticle(id: string) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <!-- 错误状态 -->
  <ErrorState 
    v-if="error && !loading"
    :message="error"
    @retry="() => loadArticle(route.params.id as string)"
  />

  <!-- 加载状态 -->
  <div v-else-if="loading" class="w-full max-w-4xl mx-auto flex justify-center items-center py-20">
    <div class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blog-border/20 backdrop-blur-sm">
      <el-icon class="w-5 h-5 text-blog-primary animate-spin">
        <RefreshRight />
      </el-icon>
      <span class="text-sm sm:text-base text-blog-muted">加载文章内容...</span>
    </div>
  </div>

  <div v-else-if="article" class="article animate-slide-up">
    <el-button class="mb-4 inline-flex items-center gap-1.5" text type="primary" @click="goBack">
      <el-icon class="w-4 h-4"><ArrowLeft /></el-icon>
      返回列表
    </el-button>

    <article class="bg-blog-card dark:bg-blog-card rounded-2xl border border-blog-border p-5 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight leading-tight">
        {{ article.title }}
      </h1>
      <div class="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-blog-muted">
        <span class="inline-flex items-center gap-1">
          <el-icon class="w-4 h-4"><Calendar /></el-icon>
          {{ formatDate(article.date) }}
        </span>
        <span v-if="readingTimeText" class="inline-flex items-center gap-1">
          <el-icon class="w-4 h-4"><Clock /></el-icon>
          {{ readingTimeText }}
        </span>
        <el-tag
          v-for="tag in article.tags"
          :key="tag"
          size="small"
          type="info"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>
      <div
        class="mt-5 sm:mt-6 prose prose-sm sm:prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed article-body prose-serif"
        v-html="article.content"
      />
      <div
        v-if="prevNext.prev || prevNext.next"
        class="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-blog-border flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between"
      >
        <div v-if="prevNext.prev" class="min-w-0">
          <span class="text-xs text-blog-muted">上一篇</span>
          <button
            type="button"
            class="flex items-center gap-1 mt-1 text-blog-primary hover:underline truncate"
            @click="goArticle(prevNext.prev!.id)"
          >
            <el-icon class="w-4 h-4 flex-shrink-0"><ArrowLeft /></el-icon>
            <span class="truncate">{{ prevNext.prev.title }}</span>
          </button>
        </div>
        <div v-if="prevNext.next" class="min-w-0 sm:text-right">
          <span class="text-xs text-blog-muted">下一篇</span>
          <button
            type="button"
            class="flex items-center gap-1 mt-1 text-blog-primary hover:underline truncate sm:justify-end"
            @click="goArticle(prevNext.next!.id)"
          >
            <span class="truncate">{{ prevNext.next!.title }}</span>
            <el-icon class="w-4 h-4 flex-shrink-0"><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </article>
  </div>
  <div v-else class="text-center py-12 text-blog-muted">
    <p>未找到该文章</p>
    <el-button class="mt-4" type="primary" @click="goBack">返回首页</el-button>
  </div>
</template>

<style scoped>
.article-body :deep(p) {
  margin-bottom: 0.875rem;
  line-height: 1.75;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--color-blog-primary);
}

.article-body :deep(code) {
  padding: 0.2rem 0.4rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.25rem;
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--color-blog-primary);
}

.dark .article-body :deep(code) {
  background: rgba(196, 181, 253, 0.15);
  border-color: rgba(196, 181, 253, 0.25);
  color: #e9d5ff;
}

.article-body :deep(pre) {
  margin: 1.25rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid var(--color-blog-border);
  border-radius: 0.75rem;
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}

.dark .article-body :deep(pre) {
  background: #0f1419;
  border-color: var(--color-blog-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.article-body :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: #e5e7eb;
}

.article-body :deep(a) {
  color: var(--color-blog-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color var(--transition-base);
}

.article-body :deep(a:hover) {
  color: var(--color-blog-secondary);
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--color-blog-primary);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: var(--color-blog-muted);
}

.dark .article-body :deep(blockquote) {
  border-left-color: #c4b5fd;
  color: #d1d5db;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.article-body :deep(li) {
  margin: 0.25rem 0;
}

@media (max-width: 640px) {
  .article-body :deep(pre) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
