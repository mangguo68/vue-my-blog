const IMAGE_API_BASE = 'https://t.alcy.cc/pc'

/**
 * 获取图片 API 地址，带 id 参数防止浏览器缓存
 * @param id 唯一标识，不同 id 可返回不同图片并避免缓存
 */
export function getImageUrl(id: string | number): string {
  return `${IMAGE_API_BASE}?id=${encodeURIComponent(String(id))}`
}
