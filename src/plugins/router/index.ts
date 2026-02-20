import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

router.beforeEach((to, from, next) => {
  const publicPaths = ['/login', '/register']
  const isAuth = isAuthenticated()
  
  if (!publicPaths.includes(to.path) && !isAuth) {
    next('/login')
  } else if (to.path === '/login' && isAuth) {
    next('/dashboard')
  } else {
    next()
  }
})

export default function (app: App) {
  app.use(router)
}

export { router }
