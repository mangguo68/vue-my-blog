import { computed, ref } from 'vue'
import type { WelcomeBannerProps, WelcomeBannerLocale } from '@/types/components'
import enLocale from '@/locales/en'
import hiLocale from '@/locales/hi'
import idLocale from '@/locales/id'

export function useWelcomeBanner(props: WelcomeBannerProps) {
  const defaultLocale = ref<'en' | 'hi' | 'id'>('en')
  
  // 多语言文案
  const locales: Record<string, WelcomeBannerLocale> = {
    en: enLocale,
    hi: hiLocale,
    id: idLocale
  }
  
  // 当前语言环境
  const currentLocale = computed(() => {
    const locale = props.locale || defaultLocale.value
    // 验证 locale 是否支持，不支持则回退到英文
    return ['en', 'hi', 'id'].includes(locale) ? locale : 'en'
  })
  
  // 显示文本 - 带错误处理
  const displayTitle = computed(() => {
    try {
      return props.title || locales[currentLocale.value]?.welcome_title || locales.en.welcome_title
    } catch (error) {
      console.warn('WelcomeBanner: Error loading title', error)
      return 'Welcome'
    }
  })
  
  const displaySubtitle = computed(() => {
    try {
      return props.subtitle || locales[currentLocale.value]?.welcome_subtitle || locales.en.welcome_subtitle
    } catch (error) {
      console.warn('WelcomeBanner: Error loading subtitle', error)
      return 'Discover amazing features and services'
    }
  })
  
  return {
    displayTitle,
    displaySubtitle,
    currentLocale
  }
}