<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import {
  Sunny,
  Moon,
  CaretTop,
  HomeFilled,
  Box,
  CollectionTag,
  Folder,
  User,
  Document,
  CoffeeCup,
} from '@element-plus/icons-vue'
import HeaderSearch from './HeaderSearch.vue'

const router = useRouter()
const route = useRoute()
const theme = useThemeStore()
const showBackTop = ref(false)

function go(path: string) {
  if (route.path !== path) router.push(path)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  showBackTop.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="min-h-screen bg-blog-bg flex flex-col animate-fade-in">
    <header class="modern-header border-b border-blog-border/30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blog-primary transition-colors group"
          @click="go('/')"
        >
          <span class="flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl bg-gradient-to-br from-blog-primary to-blog-secondary text-white shadow-md group-hover:scale-110 transition-transform">
            <el-icon class="w-4 h-4 sm:w-5 sm:h-5"><Document /></el-icon>
          </span>
          <span class="bg-gradient-to-r from-blog-primary to-blog-secondary bg-clip-text text-transparent">
            我的博客
          </span>
        </button>
        <nav class="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
          <HeaderSearch class="order-last md:order-none w-full md:w-auto mt-2 md:mt-0" />
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
              route.path === '/' 
                ? 'text-white bg-gradient-to-r from-blog-primary to-blog-secondary shadow-md' 
                : 'text-blog-muted hover:text-blog-primary hover:bg-blog-border/20'
            ]"
            @click="go('/')"
          >
            <el-icon class="w-3.5 h-3.5 sm:w-4 sm:h-4"><HomeFilled /></el-icon>
            <span class="hidden xs:inline">首页</span>
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
              route.path === '/projects' 
                ? 'text-white bg-gradient-to-r from-blog-primary to-blog-secondary shadow-md' 
                : 'text-blog-muted hover:text-blog-primary hover:bg-blog-border/20'
            ]"
            @click="go('/projects')"
          >
            <el-icon class="w-3.5 h-3.5 sm:w-4 sm:h-4"><Box /></el-icon>
            <span class="hidden xs:inline">项目</span>
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
              route.path === '/tags' 
                ? 'text-white bg-gradient-to-r from-blog-primary to-blog-secondary shadow-md' 
                : 'text-blog-muted hover:text-blog-primary hover:bg-blog-border/20'
            ]"
            @click="go('/tags')"
          >
            <el-icon class="w-3.5 h-3.5 sm:w-4 sm:h-4"><CollectionTag /></el-icon>
            <span class="hidden xs:inline">标签</span>
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
              route.path === '/archive' 
                ? 'text-white bg-gradient-to-r from-blog-primary to-blog-secondary shadow-md' 
                : 'text-blog-muted hover:text-blog-primary hover:bg-blog-border/20'
            ]"
            @click="go('/archive')"
          >
            <el-icon class="w-3.5 h-3.5 sm:w-4 sm:h-4"><Folder /></el-icon>
            <span class="hidden sm:inline">归档</span>
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
              route.path === '/about' 
                ? 'text-white bg-gradient-to-r from-blog-primary to-blog-secondary shadow-md' 
                : 'text-blog-muted hover:text-blog-primary hover:bg-blog-border/20'
            ]"
            @click="go('/about')"
          >
            <el-icon class="w-3.5 h-3.5 sm:w-4 sm:h-4"><User /></el-icon>
            <span class="hidden sm:inline">关于</span>
          </button>
          <button
            type="button"
            class="p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-blog-muted hover:bg-blog-border/30 hover:text-blog-primary transition-all"
            :title="theme.isDark ? '切换亮色' : '切换暗色'"
            @click="theme.toggle()"
          >
            <el-icon v-if="theme.isDark" class="w-4 h-4 sm:w-5 sm:h-5"><Sunny /></el-icon>
            <el-icon v-else class="w-4 h-4 sm:w-5 sm:h-5"><Moon /></el-icon>
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <RouterView />
    </main>

    <footer class="border-t border-blog-border/30 bg-gradient-to-r from-blog-card/80 to-blog-card/60 backdrop-blur-lg py-8 sm:py-12 mt-auto">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col items-center gap-6 text-center">
          <div class="flex items-center gap-3 text-blog-muted">
            <el-icon class="w-5 h-5 text-blog-primary"><Document /></el-icon>
            <span class="text-lg font-bold bg-gradient-to-r from-blog-primary to-blog-secondary bg-clip-text text-transparent">
              个人博客
            </span>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-blog-muted">
            <span>© {{ new Date().getFullYear() }}</span>
            <span class="text-blog-border">·</span>
            <span class="inline-flex items-center gap-2 font-medium">
              Vue 3 · TypeScript · Tailwind · Element Plus
            </span>
          </div>
          <p class="text-sm text-blog-muted/80 inline-flex items-center gap-2">
            <el-icon class="w-4 h-4 text-blog-accent"><CoffeeCup /></el-icon>
            写写代码，记记笔记
          </p>
        </div>
      </div>
    </footer>

    <Transition name="slide-fade">
      <button
        v-show="showBackTop"
        type="button"
        class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blog-primary to-blog-secondary text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        title="返回顶部"
        @click="scrollToTop"
      >
        <el-icon class="w-5 h-5"><CaretTop /></el-icon>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all var(--transition-slow) ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* 小屏幕断点 */
@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
}
</style>
