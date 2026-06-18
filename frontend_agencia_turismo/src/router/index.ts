import { createRouter, createWebHistory } from 'vue-router'
import { getTokenFromLocalStorage } from '@/helpers/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/destinos',
      name: 'destinos',
      component: () => import('../views/DestinoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/guias-turisticos',
      name: 'guias-turisticos',
      component: () => import('../views/GuiaTuristicoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transportes',
      name: 'transportes',
      component: () => import('../views/TransporteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/paquetes-turisticos',
      name: 'paquetes-turisticos',
      component: () => import('../views/PaqueteTuristicoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('../views/ReservaView.vue'),
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/pagos',
    //   name: 'pagos',
    //   component: () => import('../views/PagoView.vue'),
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/resenas',
      name: 'resenas',
      component: () => import('../views/ResenaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuarioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClienteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/itinerarios',
      name: 'itinerarios',
      component: () => import('../views/ItinerarioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/extras',
      name: 'extras',
      component: () => import('../views/ExtraView.vue'),
      meta: { requiresAuth: true },
    },
    // Ruta 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const token = getTokenFromLocalStorage()

  // Si requiere auth y no hay token, redirigir a login
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  // Si está logueado y va a login, redirigir al dashboard
  if (token && to.path === '/login') {
    return '/dashboard'
  }
})

export default router
