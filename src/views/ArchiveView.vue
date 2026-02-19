<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, Calendar, Document, Clock, CollectionTag, Star, Promotion, HotWater, View, DataAnalysis, ArrowRightBold, RefreshRight } from '@element-plus/icons-vue'
import { articleApi } from '@/services'
import { useReadingTime, formatReadingTime } from '@/composables/useReadingTime'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const groups = ref<any[]>([])
const tags = ref<Array<{ name: string; count: number }>>([])

// 按文章数量排序的标签
const popularTags = computed(() =>
  [...tags.value]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
)

// 获取最活跃的年份
const mostActiveYear = computed(() => {
  if (groups.value.length === 0) return null
  return groups.value
    .map(g => ({
      year: g.year,
      count: g.months.reduce((sum: number, m: any) => sum + m.articles.length, 0)
    }))
    .sort((a, b) => b.count - a.count)[0]
})

// 统计信息
const stats = computed(() => {
  const totalArticles = groups.value.reduce((sum, g) =>
    sum + g.months.reduce((mSum: number, m: any) => mSum + m.articles.length, 0), 0
  )

  const totalYears = groups.value.length
  const totalMonths = groups.value.reduce((sum, g) => sum + g.months.length, 0)

  const totalWords = groups.value.reduce((sum, g) =>
    sum + g.months.reduce((mSum: number, m: any) =>
      mSum + m.articles.reduce((aSum: number, a: any) =>
        aSum + a.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().split(' ').length, 0
      ), 0
    ), 0
  )

  const totalReadingTime = groups.value.reduce((sum, g) =>
    sum + g.months.reduce((mSum: number, m: any) =>
      mSum + m.articles.reduce((aSum: number, a: any) => aSum + useReadingTime(a.content), 0), 0
    ), 0
  )

  // 计算平均每月文章数
  const avgMonthly = totalMonths > 0 ? Math.round(totalArticles / totalMonths) : 0

  return {
    totalArticles,
    totalYears,
    totalMonths,
    totalWords: (totalWords / 1000).toFixed(1) + 'k',
    totalReadingTime: formatReadingTime(totalReadingTime),
    avgMonthly
  }
})

// 使用统一的 API 服务加载数据
async function loadData() {
  loading.value = true
  error.value = null
  try {
    // 并行请求归档分组和标签数据
    const [archiveRes, tagsRes] = await Promise.all([
      articleApi.getArchiveGroups(),
      articleApi.getAllTags()
    ])
    
    groups.value = archiveRes.data
    tags.value = tagsRes.data
  } catch (err) {
    console.error('加载归档数据失败:', err)
    error.value = err instanceof Error ? err.message : '归档数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const monthNames: Record<number, string> = {
  1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月',
  7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月',
}

function goArticle(id: string) {
  router.push(`/article/${id}`)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

function readingTime(content: string) {
  return formatReadingTime(useReadingTime(content))
}
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:gap-10 animate-slide-up">
    <!-- 错误状态 -->
    <ErrorState 
      v-if="error && !loading"
      :message="error"
      @retry="loadData"
    />

    <!-- 加载状态 -->
    <div v-else-if="loading" class="flex-1 flex justify-center items-center py-20">
      <div class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blog-border/20 backdrop-blur-sm">
        <el-icon class="w-5 h-5 text-blog-primary animate-spin">
          <RefreshRight />
        </el-icon>
        <span class="text-sm sm:text-base text-blog-muted">加载归档数据...</span>
      </div>
    </div>

    <!-- 主内容区 -->
    <template v-else>
    <div class="flex-1 min-w-0">
      <!-- 页面头部 -->
      <div class="text-center py-10 lg:py-12 mb-10 px-4">
        <div
          class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary mb-6 shadow-lg mx-auto">
          <el-icon class="w-8 h-8">
            <Folder />
          </el-icon>
        </div>
        <h1 class="heading-1 text-gray-800 dark:text-gray-100 mb-4">
          文章归档
        </h1>
        <p class="page-section-desc text-xl leading-relaxed">
          按时间轴梳理创作历程，记录技术成长的每一步
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blog-muted">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blog-border/30 backdrop-blur-sm">
            <el-icon class="w-4 h-4 text-blog-primary">
              <Document />
            </el-icon>
            共 {{ stats.totalArticles }} 篇文章
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blog-border/30 backdrop-blur-sm">
            <el-icon class="w-4 h-4 text-blog-primary">
              <Calendar />
            </el-icon>
            跨越 {{ stats.totalYears }} 年
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blog-border/30 backdrop-blur-sm">
            <el-icon class="w-4 h-4 text-blog-primary">
              <Star />
            </el-icon>
            最佳年份 {{ mostActiveYear?.year }}
          </span>
        </div>
      </div>

      <!-- 归档时间线 -->
      <div class="space-y-8">
        <section v-for="(g, groupIndex) in groups" :key="g.year" class="modern-card shadow-purple animate-fade-in"
          :style="{ animationDelay: `${groupIndex * 0.1}s` }">
          <div
            class="px-6 py-5 border-b border-blog-border/50 bg-gradient-to-r from-blog-primary/5 to-transparent rounded-t-2xl">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 inline-flex items-center gap-3">
                <span
                  class="flex w-10 h-10 items-center justify-center rounded-xl bg-blog-primary/10 text-blog-primary">
                  <el-icon class="w-5 h-5">
                    <Folder />
                  </el-icon>
                </span>
                {{ g.year }} 年
              </h2>
              <span class="px-4 py-2 rounded-full bg-blog-primary/10 text-blog-primary font-medium">
                {{g.months.reduce((sum: number, m: any) => sum + m.articles.length, 0)}} 篇文章
              </span>
            </div>
          </div>
          <div class="divide-y divide-blog-border">
            <div v-for="m in g.months" :key="`${g.year}-${m.month}`"
              class="p-5 hover:bg-blog-border/5 transition-all duration-300 group">
              <h3 class="text-base font-semibold text-blog-muted mb-4 inline-flex items-center gap-2">
                <span
                  class="flex w-8 h-8 items-center justify-center rounded-lg bg-blog-border/30 text-blog-primary group-hover:bg-blog-primary/20 transition-colors">
                  <el-icon class="w-4 h-4">
                    <Calendar />
                  </el-icon>
                </span>
                {{ monthNames[m.month] }}
                <span
                  class="text-sm bg-gradient-to-r from-blog-primary/20 to-blog-secondary/20 text-blog-primary px-3 py-1 rounded-full font-medium">
                  {{ m.articles.length }} 篇
                </span>
              </h3>
              <ul class="space-y-3">
                <li v-for="a in m.articles" :key="a.id" class="group/article">
                  <button type="button"
                    class="text-left w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl hover:bg-blog-primary/5 dark:hover:bg-blog-primary/10 transition-all duration-300 group-hover:translate-x-1 border border-transparent hover:border-blog-border/30"
                    @click="goArticle(a.id)">
                    <div class="flex-1 min-w-0">
                      <div
                        class="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover/article:text-blog-primary transition-colors truncate mb-2">
                        {{ a.title }}
                      </div>
                      <div class="flex flex-wrap items-center gap-3 text-sm text-blog-muted">
                        <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blog-border/20">
                          <el-icon class="w-3.5 h-3.5 text-blog-primary">
                            <Calendar />
                          </el-icon>
                          {{ formatDate(a.date) }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blog-border/20">
                          <el-icon class="w-3.5 h-3.5 text-blog-primary">
                            <Clock />
                          </el-icon>
                          {{ readingTime(a.content) }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blog-border/20">
                          <el-icon class="w-3.5 h-3.5 text-blog-primary">
                            <CollectionTag />
                          </el-icon>
                          {{ a.tags.length }} 标签
                        </span>
                      </div>
                    </div>
                    <div class="flex-shrink-0 mt-3 sm:mt-0">
                      <div class="flex flex-wrap gap-2">
                        <el-tag v-for="tag in a.tags.slice(0, 2)" :key="tag" size="small" type="info" effect="plain"
                          class="transition-all duration-200 hover:scale-105">
                          {{ tag }}
                        </el-tag>
                        <span v-if="a.tags.length > 2" class="text-xs text-blog-muted self-center">+{{ a.tags.length - 2
                        }}</span>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 侧边栏 -->
    <aside class="lg:w-80 flex-shrink-0 mt-10 lg:mt-0">
      <div class="space-y-8 sticky top-28">
        <!-- 创作统计 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 inline-flex items-center gap-3">
            <span
              class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5">
                <DataAnalysis />
              </el-icon>
            </span>
            创作统计
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div
              class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                <Document />
              </el-icon>
              <div class="text-2xl font-bold text-blog-primary">{{ stats.totalArticles }}</div>
              <div class="text-xs text-blog-muted mt-1">总文章数</div>
            </div>
            <div
              class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                <Calendar />
              </el-icon>
              <div class="text-2xl font-bold text-blog-primary">{{ stats.totalYears }}</div>
              <div class="text-xs text-blog-muted mt-1">年份跨度</div>
            </div>
            <div
              class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                <HotWater />
              </el-icon>
              <div class="text-2xl font-bold text-blog-primary">{{ stats.avgMonthly }}</div>
              <div class="text-xs text-blog-muted mt-1">月均产出</div>
            </div>
            <div
              class="text-center p-4 bg-blog-border/20 rounded-xl hover:bg-blog-border/30 transition-all duration-300 group">
              <el-icon class="w-8 h-8 text-blog-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                <View />
              </el-icon>
              <div class="text-2xl font-bold text-blog-primary">{{ stats.totalWords }}</div>
              <div class="text-xs text-blog-muted mt-1">总字数</div>
            </div>
          </div>
          <div
            class="pt-4 pb-4 border-t border-blog-border text-center bg-gradient-to-r from-blog-bg/50 to-blog-bg/30 rounded-b-2xl">
            <div class="text-sm text-blog-muted mb-2">累计阅读时长</div>
            <div class="text-xl font-bold text-blog-primary">{{ stats.totalReadingTime }}</div>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span
              class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5">
                <Promotion />
              </el-icon>
            </span>
            热门标签
          </h3>
          <div class="space-y-3">
            <div v-for="(tag, index) in popularTags" :key="tag.name"
              class="flex items-center justify-between p-3 rounded-xl bg-blog-border/20 hover:bg-blog-border/30 transition-all duration-300 group cursor-pointer"
              @click="router.push(`/tags?tag=${encodeURIComponent(tag.name)}`)">
              <div class="flex items-center gap-3">
                <span class="flex w-8 h-8 items-center justify-center rounded-lg text-white font-bold text-sm" :class="[
                  index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      index === 2 ? 'bg-gradient-to-br from-green-500 to-teal-500' :
                        'bg-gradient-to-br from-blog-primary to-blog-secondary'
                ]">
                  {{ index + 1 }}
                </span>
                <span
                  class="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blog-primary transition-colors">
                  {{ tag.name }}
                </span>
              </div>
              <span class="text-sm text-blog-muted font-medium">
                {{ tag.count }}篇
              </span>
            </div>
          </div>
          <button type="button"
            class="w-full mt-4 text-sm text-blog-primary hover:text-blog-secondary font-medium inline-flex items-center justify-center gap-2 transition-colors group py-2"
            @click="router.push('/tags')">
            查看全部标签
            <el-icon class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
              <ArrowRightBold />
            </el-icon>
          </button>
        </div>

        <!-- 创作里程碑 -->
        <div class="modern-card shadow-purple">
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 inline-flex items-center gap-3">
            <span
              class="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary/20 to-blog-secondary/20 text-blog-primary">
              <el-icon class="w-5 h-5">
                <Star />
              </el-icon>
            </span>
            创作里程碑
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 dark:from-green-500/20 dark:to-emerald-500/20 dark:border-green-500/40">
              <div class="flex-shrink-0 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2"></div>
              <div>
                <div class="font-medium text-gray-800 dark:text-gray-100">首次发文</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">开启技术博客之旅</div>
              </div>
            </div>
            <div
              class="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 dark:from-blue-500/20 dark:to-indigo-500/20 dark:border-blue-500/40">
              <div class="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div class="font-medium text-gray-800 dark:text-gray-100">{{ mostActiveYear?.count }}篇文章</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ mostActiveYear?.year }}年创作高峰</div>
              </div>
            </div>
            <div
              class="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 dark:from-purple-500/20 dark:to-pink-500/20 dark:border-purple-500/40">
              <div class="flex-shrink-0 w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div class="font-medium text-gray-800 dark:text-gray-100">{{ stats.totalArticles }}篇积累</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">持续创作的技术沉淀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </template>
  </div>
</template>