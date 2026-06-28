import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Products from '@/pages/Products.vue'

const routes = [
  // Auth routes - public
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },

  // Protected routes
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true },
  },

  // Default route
  {
    path: '/',
    redirect: '/login',
  },

  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('currentUser')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Trying to access protected route without login
    return '/login'
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // Already logged in, trying to access login/register
    return '/dashboard'
  }
})

export default router
