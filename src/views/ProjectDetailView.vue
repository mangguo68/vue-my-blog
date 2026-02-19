<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Box, 
  StarFilled, 
  Link, 
  ArrowLeft, 
  RefreshRight, 
  Warning,
  Calendar,
  User,
  Document,
  Promotion
} from '@element-plus/icons-vue'
import ErrorState from '@/components/ErrorState.vue'
import * as api from '@/services'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()
const project = ref<Project | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const projectId = computed(() => route.params.id as string)

// 初始化数据
async function initializeData() {
  if (!projectId.value) {
    error.value = '项目ID不存在'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const res = await api.projectApi.getProjectById(projectId.value)
    project.value = res.data
    
    if (!project.value) {
      error.value = '项目不存在'
    }
  } catch (err) {
    console.error('获取项目详情失败:', err)
    error.value = err instanceof Error ? err.message : '项目数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(initializeData)

function goBack() {
  router.back()
}

function openUrl(url: string) {
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <!-- 返回按钮 -->
    <div class="mb-8">
      <el-button 
        type="primary" 
        plain 
        size="large"
        round
        @click="goBack"
        class="bg-transparent border-blog-primary text-blog-primary hover:bg-blog-primary/10 px-6 py-3 text-base font-medium transition-all duration-300 hover:-translate-x-1"
      >
        <el-icon class="w-5 h-5 mr-2"><ArrowLeft /></el-icon>
        返回项目列表
      </el-button>
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
        <span class="text-blog-muted">项目详情加载中...</span>
      </div>
    </div>
    
    <!-- 项目详情 -->
    <div v-else-if="project" class="space-y-8">
      <!-- 项目头部信息 -->
      <div class="modern-card p-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- 项目图片 -->
          <div class="md:w-1/3 flex-shrink-0">
            <div class="rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-blog-primary/20 via-purple-500/20 to-pink-500/20 dark:from-blog-primary/30 dark:via-purple-500/30 dark:to-pink-500/30 flex items-center justify-center">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.name"
                class="w-full h-full object-cover"
              />
              <el-icon v-else class="w-16 h-16 text-blog-primary/50"><Box /></el-icon>
            </div>
          </div>
          
          <!-- 项目信息 -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {{ project.name }}
            </h1>
            
            <p class="text-lg text-blog-muted leading-relaxed mb-6">
              {{ project.description }}
            </p>
            
            <!-- 项目元信息 -->
            <div class="flex flex-wrap items-center gap-4 mb-6">
              <span v-if="project.stars" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                <el-icon class="w-4 h-4"><StarFilled /></el-icon>
                {{ project.stars }} stars
              </span>
              
              <span v-if="project.date" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blog-border/30 text-blog-muted">
                <el-icon class="w-4 h-4"><Calendar /></el-icon>
                {{ formatDate(project.date) }}
              </span>
            </div>
            
            <!-- 技术栈 -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">技术栈</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.techs"
                  :key="tech"
                  class="px-3 py-1.5 rounded-lg text-sm bg-blog-primary/15 dark:bg-blog-primary/25 text-blog-primary border border-blog-primary/30"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex flex-wrap gap-4 pt-4">
              <el-button
                v-if="project.repo"
                type="primary"
                size="large"
                round
                @click="openUrl(project.repo)"
                class="bg-blog-primary hover:bg-blog-secondary border-blog-primary px-6 py-3 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <el-icon class="w-5 h-5 mr-2"><Document /></el-icon>
                查看源码
              </el-button>
              
              <el-button
                v-if="project.demo"
                type="success"
                size="large"
                round
                @click="openUrl(project.demo)"
                class="px-6 py-3 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <el-icon class="w-5 h-5 mr-2"><Promotion /></el-icon>
                访问演示
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 项目详细介绍 -->
      <div v-if="project.details" class="modern-card p-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">项目详情</h2>
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <p class="text-blog-muted leading-relaxed">{{ project.details }}</p>
        </div>
      </div>
      
      <!-- 功能特性 -->
      <div v-if="project.features && project.features.length > 0" class="modern-card p-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">主要功能</h2>
        <ul class="space-y-3">
          <li
            v-for="feature in project.features"
            :key="feature"
            class="flex items-start gap-3 p-4 rounded-xl bg-blog-border/20 hover:bg-blog-border/30 transition-colors"
          >
            <div class="flex-shrink-0 w-2 h-2 rounded-full bg-blog-primary mt-2"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>