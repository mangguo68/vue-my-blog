import { createRouter, createWebHistory } from 'vue-router'
import BlogLayout from '@/components/BlogLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BlogLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'tags', name: 'tags', component: () => import('@/views/TagsView.vue') },
        { path: 'archive', name: 'archive', component: () => import('@/views/ArchiveView.vue') },
        { path: 'projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
        { path: 'project/:id', name: 'project-detail', component: () => import('@/views/ProjectDetailView.vue') },
        { path: 'about', name: 'about', component: () => import('@/views/AboutView.vue') },
        {
          path: 'article/:id',
          name: 'article',
          component: () => import('@/views/ArticleView.vue'),
        },
      ],
    },
  ],
})

export default router
