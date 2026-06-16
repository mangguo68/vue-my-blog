<script setup lang="ts">
import { Document, Star, CoffeeCup } from '@element-plus/icons-vue'
</script>

<template>
  <div class="welcome-banner bg-gradient-to-r from-blog-primary/10 via-blog-secondary/8 to-blog-accent/10 dark:from-blog-primary/20 dark:via-blog-secondary/15 dark:to-blog-accent/20 border-b border-blog-border/30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div class="text-center space-y-4 sm:space-y-6">
        <!-- 博客标志 -->
        <div class="flex justify-center mb-4 sm:mb-6">
          <div class="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blog-primary to-blog-secondary text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <el-icon class="w-8 h-8 sm:w-10 sm:h-10">
              <Document />
            </el-icon>
          </div>
        </div>
        
        <!-- 博客名称 -->
        <h1 class="heading-1 text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
          <span class="bg-gradient-to-r from-blog-primary via-blog-secondary to-blog-accent bg-clip-text text-transparent font-bold">
            我的技术博客
          </span>
        </h1>
        
        <!-- 欢迎标语 -->
        <div class="space-y-2 sm:space-y-3">
          <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-200 font-medium">
            欢迎来到我的技术世界
          </p>
          <p class="text-sm sm:text-base text-blog-muted max-w-2xl mx-auto leading-relaxed">
            在这里分享前端技术、编程心得与生活感悟，记录成长路上的点点滴滴
          </p>
        </div>
        
        <!-- 装饰元素 -->
        <div class="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blog-primary/10 dark:bg-blog-primary/20 text-blog-primary">
            <el-icon class="w-4 h-4">
              <Star />
            </el-icon>
            <span class="text-sm font-medium">持续更新</span>
          </div>
          <div class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blog-secondary/10 dark:bg-blog-secondary/20 text-blog-secondary">
            <el-icon class="w-4 h-4">
              <CoffeeCup />
            </el-icon>
            <span class="text-sm font-medium">用心分享</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-banner {
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(192, 132, 252, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.dark .welcome-banner::before {
  background: 
    radial-gradient(circle at 20% 30%, rgba(196, 181, 253, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .welcome-banner {
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.08) 0%, 
      rgba(167, 139, 250, 0.06) 50%, 
      rgba(192, 132, 252, 0.08) 100%);
  }
  
  .dark .welcome-banner {
    background: linear-gradient(135deg, 
      rgba(196, 181, 253, 0.15) 0%, 
      rgba(167, 139, 250, 0.12) 50%, 
      rgba(139, 92, 246, 0.15) 100%);
  }
}
</style>