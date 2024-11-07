import { createRouter, createWebHistory } from 'vue-router'
import Index from '../components/index.vue'
import InputScreen from '../components/inputScreen.vue'
import Result from '../components/result.vue'

const routes = [
  { path: '/', name: 'Index', component: Index},
  { path: '/Input', name: 'Input', component: InputScreen},
  { path: '/Result', name: 'Result', component: Result}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
  
export default router