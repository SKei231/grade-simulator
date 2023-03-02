import { createRouter, createWebHistory } from 'vue-router'
import Index from '../components/index.vue'
import Result from '../components/result.vue'

const routes = [
  { path: '/', name: 'Index', component: Index},
  { path: '/Result', name: 'Result', component: Result}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
  
export default router