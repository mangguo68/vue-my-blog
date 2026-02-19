<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import { searchArticles } from '@/data/articles'
import type { Article } from '@/types/blog'

const router = useRouter()
const keyword = ref('')
const open = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

const results = computed(() => searchArticles(keyword.value))

watch(keyword, (v) => {
  open.value = v.trim().length > 0
})

function goArticle(a: Article) {
  keyword.value = ''
  open.value = false
  router.push(`/article/${a.id}`)
}

function goSearchPage() {
  if (!keyword.value.trim()) return
  open.value = false
  router.push({ path: '/', query: { q: keyword.value.trim() } })
  keyword.value = ''
}

function onBlur() {
  setTimeout(() => { open.value = false }, 150)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') goSearchPage()
}
</script>

<template>
  <div class="relative w-full md:w-auto">
    <div
      class="flex items-center gap-2 w-full md:w-52 lg:w-60 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-blog-border px-3 py-2 focus-within:ring-2 focus-within:ring-blog-primary/50 focus-within:border-blog-primary transition-all backdrop-blur-sm shadow-sm hover:shadow-md"
    >
      <el-icon class="w-4 h-4 text-blog-muted shrink-0"><Search /></el-icon>
      <input
        ref="inputEl"
        v-model="keyword"
        type="text"
        placeholder="搜索文章..."
        class="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        @focus="open = keyword.trim().length > 0"
        @blur="onBlur"
        @keydown="onKeydown"
      />
    </div>
    <Transition name="dropdown">
      <div
        v-show="open"
        class="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl bg-blog-card dark:bg-blog-card border border-blog-border shadow-xl z-50 max-h-72 overflow-auto"
      >
        <template v-if="results.length">
          <button
            v-for="a in results.slice(0, 8)"
            :key="a.id"
            type="button"
            class="w-full px-4 py-2.5 text-left text-sm hover:bg-blog-primary/10 dark:hover:bg-blog-primary/20 transition-colors flex flex-col gap-0.5"
            @mousedown.prevent="goArticle(a)"
          >
            <span class="font-medium text-gray-800 dark:text-gray-100 truncate">{{ a.title }}</span>
            <span class="text-blog-muted text-xs truncate">{{ a.summary }}</span>
          </button>
          <button
            type="button"
            class="w-full px-4 py-2 text-sm text-blog-primary hover:bg-blog-primary/10 border-t border-blog-border inline-flex items-center justify-center gap-1"
            @mousedown.prevent="goSearchPage"
          >
            在首页查看全部结果
            <el-icon class="w-4 h-4"><ArrowRight /></el-icon>
          </button>
        </template>
        <div v-else class="px-4 py-4 text-sm text-blog-muted text-center">
          无匹配文章，按 Enter 在首页搜索
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 确保 input 完全透明，无边框 */
input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 0;
  margin: 0;
  /* 自定义光标样式 */
  caret-color: var(--color-blog-primary);
}

input:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* 暗色模式下的光标颜色 */
.dark input {
  caret-color: #c4b5fd;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity var(--transition-fast) ease, transform var(--transition-fast) ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
