import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: () => import('@/views/recommend/recommend')
  },
  {
    path: '/rank',
    component: () => import('@/views/rank/rank')
  },
  {
    path: '/search',
    component: () => import('@/views/search/search')
  },
  {
    path: '/singer',
    component: () => import('@/views/singer/singer')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
