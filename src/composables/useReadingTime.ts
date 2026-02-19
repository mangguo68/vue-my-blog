const WORDS_PER_MINUTE = 200

/** 根据纯文本或 HTML 内容估算阅读时间（分钟） */
export function useReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(minutes: number): string {
  return minutes <= 1 ? '约 1 分钟' : `约 ${minutes} 分钟`
}
