import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/preview/reino',
      name: 'kingdom-preview',
      component: () => import('@/views/KingdomPreviewView.vue'),
      meta: { title: 'Preview Reino' },
    },
    {
      path: '/preview/ciudad',
      redirect: '/preview/reino',
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: 'Inicio' },
        },
        {
          path: 'ciudad',
          name: 'city',
          component: () => import('@/views/KingdomView.vue'),
          meta: { title: 'Mi Reino' },
        },
        {
          path: 'reino',
          redirect: '/ciudad',
        },
        {
          path: 'movimientos',
          name: 'transactions',
          component: () => import('@/views/TransactionsView.vue'),
          meta: { title: 'Movimientos' },
        },
        {
          path: 'metas',
          name: 'goals',
          component: () => import('@/views/GoalsView.vue'),
          meta: { title: 'Metas' },
        },
        {
          path: 'perfil',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: { title: 'Perfil' },
        },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
