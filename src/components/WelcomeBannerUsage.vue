<!--
  这个文件展示了如何在 HomeView.vue 中集成 WelcomeBanner 组件
  请参考此文件的代码，手动将 WelcomeBanner 添加到 HomeView.vue 中
-->

<template>
  <div>
    <!-- WelcomeBanner 应该放在最顶部，在其他内容之前 -->
    <WelcomeBanner 
      :locale="currentLanguage" 
      :title="customTitle"
      :subtitle="customSubtitle"
      :customClass="bannerCustomClass"
    />
    
    <!-- 原有的页面内容放在这里 -->
    <!-- ... HomeView.vue 的其余内容 ... -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'

// 示例配置 - 可以根据需要调整
const currentLanguage = ref<'en' | 'hi' | 'id'>('en')
const customTitle = ref('') // 空字符串将使用默认多语言文案
const customSubtitle = ref('') // 空字符串将使用默认多语言文案
const bannerCustomClass = ref('mb-8') // 添加底部间距

// 如果需要根据路由或其他条件动态设置语言
// 可以在这里添加相应逻辑
</script>

<!--
集成说明：
1. 在 HomeView.vue 的 script setup 中导入 WelcomeBanner 组件
2. 在 template 的最顶部添加 <WelcomeBanner> 标签
3. 可以通过 props 自定义标题、副标题、语言和样式
4. 默认情况下组件会显示英文文案，可以通过 locale prop 切换语言
5. 建议添加 mb-8 等底部间距类来与下方内容保持适当距离
-->