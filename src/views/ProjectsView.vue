<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Box, StarFilled, Link, ArrowRight, RefreshRight, Warning } from '@element-plus/icons-vue'
import ErrorState from '@/components/ErrorState.vue'
import * as api from '@/services'
import type { Project } from '@/types/project'

const router = useRouter()
const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 初始化数据
async function initializeData() {
  loading.value = true
  error.value = null
  try {
    const res = await api.projectApi.getProjects()
    projects.value = res.data
  } catch (err) {
    console.error('获取项目列表失败:', err)
    error.value = err instanceof Error ? err.message : '项目数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(initializeData)

function openUrl(url: string) {
  if (url.startsWith('http')) window.open(url, '_blank')
  else router.push(url)
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="text-center mb-12">
      <div class="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-blog-primary/10 text-blog-primary mb-4">
        <el-icon class="w-9 h-9"><Box /></el-icon>
      </div>
      <h1 class="page-section-title text-3xl text-gray-800 dark:text-gray-100">
        开源项目
      </h1>
      <p class="page-section-desc mt-2">做过的、在维护的一些小项目</p>
    </div>

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
        <span class="text-blog-muted">项目加载中...</span>
      </div>
    </div>
    
    <!-- 项目列表 -->
    <div v-else class="grid gap-6 sm:grid-cols-2">
      <article
        v-for="p in projects"
        :key="p.id"
        class="project-card group rounded-2xl border border-blog-border bg-blog-card dark:bg-blog-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blog-primary/15 hover:-translate-y-1 hover:border-blog-primary/50 cursor-pointer"
        @click="router.push(`/project/${p.id}`)"
      >
        <div class="relative h-36 overflow-hidden">
          <img
            v-if="p.image"
            :src="p.image"
            :alt="p.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            v-else
            class="h-full w-full bg-gradient-to-br from-blog-primary/20 via-purple-500/20 to-pink-500/20 dark:from-blog-primary/30 dark:via-purple-500/30 dark:to-pink-500/30 flex items-center justify-center"
          >
            <el-icon class="w-14 h-14 text-blog-primary/50"><Box /></el-icon>
          </div>
        </div>
        <div class="relative p-6">
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blog-primary transition-colors truncate">
              {{ p.name }}
            </h2>
            <span v-if="p.stars" class="flex-shrink-0 text-sm text-blog-muted inline-flex items-center gap-0.5">
              <el-icon class="w-4 h-4 text-amber-500"><StarFilled /></el-icon>
              {{ p.stars }}
            </span>
          </div>
          <p class="mt-2 text-sm text-blog-muted line-clamp-2 leading-relaxed">
            {{ p.description }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="t in p.techs"
              :key="t"
              class="px-2 py-0.5 rounded-md text-xs bg-blog-primary/15 dark:bg-blog-primary/25 text-blog-primary border border-blog-primary/30"
            >
              {{ t }}
            </span>
          </div>
          <div class="mt-4 flex gap-3 text-xs">
            <button
              v-if="p.repo"
              type="button"
              class="text-blog-primary hover:underline inline-flex items-center gap-1"
              @click.stop="openUrl(p.repo!)"
            >
              <el-icon class="w-3.5 h-3.5"><Link /></el-icon>
              GitHub
              <el-icon class="w-3.5 h-3.5"><ArrowRight /></el-icon>
            </button>
            <button
              type="button"
              class="text-blog-primary hover:underline inline-flex items-center gap-1"
              @click.stop="openUrl(p.url)"
            >
              <el-icon class="w-3.5 h-3.5"><Link /></el-icon>
              访问项目
              <el-icon class="w-3.5 h-3.5"><ArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
