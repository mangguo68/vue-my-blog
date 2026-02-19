<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue'

interface Props {
  title?: string
  message?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '数据加载失败',
  message: '请稍后重试',
  showRetry: true
})

const emit = defineEmits<{
  retry: []
}>()

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <div class="flex justify-center py-8 sm:py-12 px-4">
    <div class="inline-flex flex-col items-center gap-4 px-6 sm:px-8 py-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 w-full">
      <div class="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900/30">
        <el-icon class="w-7 h-7 sm:w-8 sm:h-8 text-red-600 dark:text-red-400">
          <CircleClose />
        </el-icon>
      </div>
      <div class="text-center">
        <h3 class="text-base sm:text-lg font-semibold text-red-800 dark:text-red-200 mb-2">{{ title }}</h3>
        <p class="text-sm text-red-600 dark:text-red-400 mb-4">{{ message }}</p>
        <el-button 
          v-if="showRetry"
          type="primary" 
          size="default"
          @click="handleRetry"
        >
          重新加载
        </el-button>
      </div>
    </div>
  </div>
</template>
