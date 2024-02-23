import { createRouter, createWebHistory } from 'vue-router'
import InputField from '../components/inputField.vue'
import Result from '../components/result.vue'

const routes = [
  { path: '/', name: 'Index', component: InputField},
  { path: '/Result', name: 'Result', component: Result}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
  
export default router