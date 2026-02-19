import type { Profile } from '@/types/profile'
import { getImageUrl } from '@/utils/image'

export const profile: Profile = {
  name: '博主名',
  avatar: getImageUrl('avatar'),
  bio: '前端开发者，喜欢 Vue 与 TypeScript。写博客记录学习与踩坑，偶尔写写生活。',
  location: '某地',
  links: [
    { name: 'GitHub', icon: 'github', url: 'https://github.com' },
    { name: '掘金', icon: 'book', url: 'https://juejin.cn' },
    { name: 'Twitter', icon: 'chat', url: 'https://twitter.com' },
  ],
}
