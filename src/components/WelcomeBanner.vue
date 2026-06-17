<template>
  <div 
    class="welcome-banner w-full bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12"
    :class="customClass"
  >
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">
        {{ displayTitle }}
      </h1>
      <p class="mt-4 text-lg font-medium text-gray-600 lg:text-xl">
        {{ displaySubtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWelcomeBanner } from '@/composables/useWelcomeBanner'
import type { WelcomeBannerProps } from '@/types/components'

// Props 定义 - 带默认值和类型约束
const props = withDefaults(defineProps<WelcomeBannerProps>(), {
  title: '',
  subtitle: '',
  locale: 'en',
  customClass: ''
})

// 使用 Composable 处理业务逻辑
const { displayTitle, displaySubtitle, currentLocale } = useWelcomeBanner(props)

// 响应式样式类
const responsiveClasses = {
  container: 'w-full bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12',
  wrapper: 'max-w-4xl mx-auto text-center',
  title: 'text-3xl font-bold text-gray-900 lg:text-4xl',
  subtitle: 'mt-4 text-lg font-medium text-gray-600 lg:text-xl'
}
</script>

<style scoped>
.welcome-banner {
  --banner-bg-from: theme('colors.blue.50');
  --banner-bg-to: theme('colors.indigo.100');
  --title-color: theme('colors.gray.900');
  --subtitle-color: theme('colors.gray.600');
}

/* 确保长文本正确换行 */
.welcome-banner h1,
.welcome-banner p {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 响应式字体优化 */
@media (max-width: 767px) {
  .welcome-banner h1 {
    line-height: 1.2;
  }
  
  .welcome-banner p {
    line-height: 1.4;
  }
}

/* 桌面端字体优化 */
@media (min-width: 1024px) {
  .welcome-banner h1 {
    line-height: 1.1;
  }
  
  .welcome-banner p {
    line-height: 1.3;
  }
}

/* 可访问性改进 */
@media (prefers-reduced-motion: reduce) {
  .welcome-banner {
    transition: none;
  }
}
</style>