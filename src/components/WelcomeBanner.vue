<script setup lang="ts">
import { Document, Star, Code } from '@element-plus/icons-vue'
</script>

<template>
  <div class="welcome-banner">
    <div class="banner-content">
      <!-- 背景装饰元素 -->
      <div class="banner-decorations">
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        <div class="decoration decoration-3"></div>
      </div>
      
      <!-- 主要内容 -->
      <div class="banner-main">
        <div class="banner-icon">
          <el-icon class="icon-primary"><Document /></el-icon>
          <el-icon class="icon-secondary"><Code /></el-icon>
          <el-icon class="icon-accent"><Star /></el-icon>
        </div>
        
        <div class="banner-text">
          <h1 class="banner-title">
            欢迎来到我的技术博客
          </h1>
          <p class="banner-description">
            探索前端技术的无限可能，分享编程路上的点点滴滴
            <br class="hidden sm:block">
            在这里记录技术成长，传递知识与思考
          </p>
          
          <div class="banner-stats">
            <div class="stat-item">
              <el-icon class="stat-icon"><Document /></el-icon>
              <span>技术分享</span>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Code /></el-icon>
              <span>代码实践</span>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Star /></el-icon>
              <span>学习心得</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-banner {
  @apply relative overflow-hidden rounded-3xl mb-8 sm:mb-12;
  background: linear-gradient(135deg, 
    #8b5cf6 0%, 
    #a78bfa 25%, 
    #c084fc 50%, 
    #ddd6fe 75%, 
    #f3f4f6 100%
  );
  box-shadow: 
    0 20px 40px -10px rgba(139, 92, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  min-height: 280px;
  
  /* 响应式高度 */
  @screen sm {
    min-height: 320px;
  }
  
  @screen lg {
    min-height: 360px;
  }
}

.dark .welcome-banner {
  background: linear-gradient(135deg, 
    #4c1d95 0%, 
    #6d28d9 25%, 
    #8b5cf6 50%, 
    #a78bfa 75%, 
    #c4b5fd 100%
  );
  box-shadow: 
    0 20px 40px -10px rgba(139, 92, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.banner-content {
  @apply relative h-full p-6 sm:p-8 lg:p-12;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: inherit;
}

.banner-decorations {
  @apply absolute inset-0 overflow-hidden;
  pointer-events: none;
}

.decoration {
  @apply absolute rounded-full opacity-20;
  background: rgba(255, 255, 255, 0.3);
  animation: float 6s ease-in-out infinite;
}

.decoration-1 {
  width: 120px;
  height: 120px;
  top: -20px;
  right: -20px;
  animation-delay: 0s;
}

.decoration-2 {
  width: 80px;
  height: 80px;
  bottom: -10px;
  left: -10px;
  animation-delay: 2s;
}

.decoration-3 {
  width: 60px;
  height: 60px;
  top: 50%;
  right: 15%;
  animation-delay: 4s;
}

.dark .decoration {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-10px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(10px) rotate(240deg) scale(0.9);
  }
}

.banner-main {
  @apply relative z-10 text-center max-w-4xl mx-auto;
}

.banner-icon {
  @apply flex items-center justify-center gap-3 mb-6 sm:mb-8;
}

.banner-icon .el-icon {
  @apply w-12 h-12 sm:w-14 sm:h-14 p-3 sm:p-3.5 rounded-2xl;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: iconFloat 4s ease-in-out infinite;
}

.icon-primary {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  animation-delay: 0s;
}

.icon-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  animation-delay: 1.3s;
}

.icon-accent {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  animation-delay: 2.6s;
}

.dark .banner-icon .el-icon {
  background: rgba(255, 255, 255, 0.15);
  color: #f9fafb;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.05);
  }
}

.banner-title {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6;
  color: #ffffff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
  line-height: 1.2;
  animation: titleSlideUp 0.8s ease-out;
}

.banner-description {
  @apply text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: descSlideUp 0.8s ease-out 0.2s both;
}

@keyframes titleSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes descSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-stats {
  @apply flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8;
  animation: statsSlideUp 0.8s ease-out 0.4s both;
}

.stat-item {
  @apply flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dark .stat-item {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .stat-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

.stat-icon {
  @apply w-4 h-4 sm:w-5 sm:h-5;
}

@keyframes statsSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端优化 */
@media (max-width: 640px) {
  .banner-content {
    @apply p-4;
  }
  
  .banner-title {
    @apply text-2xl;
  }
  
  .banner-description {
    @apply text-sm;
    line-height: 1.6;
  }
  
  .banner-icon .el-icon {
    @apply w-10 h-10 p-2.5;
  }
  
  .banner-stats {
    @apply gap-2;
  }
  
  .stat-item {
    @apply px-3 py-1.5 text-xs;
  }
}

/* 减少动画 - 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .decoration,
  .banner-icon .el-icon,
  .banner-title,
  .banner-description,
  .banner-stats {
    animation: none !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .welcome-banner {
    background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%);
    border: 2px solid #ffffff;
  }
  
  .banner-title,
  .banner-description,
  .stat-item {
    color: #ffffff !important;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
}
</style>