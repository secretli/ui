import { createRouter, createWebHistory } from 'vue-router'
import Share from '../components/Share.vue'
import Retrieve from '../components/Retrieve.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/share',
      name: 'share',
      component: Share
    },
    {
      path: '/',
      name: 'retrieve',
      component: Retrieve
    },
    {
      path: '/:fallback(.*)*',
      redirect: '/'
    }
  ]
})

export default router
