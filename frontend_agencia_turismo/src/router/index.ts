import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getTokenFromLocalStorage } from '@/helpers/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/destinos', name: 'destinos', component: () => import('../views/DestinoView.vue') },
    {
      path: '/guias-turisticos',
      name: 'guias-turisticos',
      component: () => import('../views/GuiaTuristicoView.vue'),
    },
    {
      path: '/transportes',
      name: 'transportes',
      component: () => import('../views/TransporteView.vue'),
    },
    {
      path: '/paquetes-turisticos',
      name: 'paquetes-turisticos',
      component: () => import('../views/PaqueteTuristicoView.vue'),
    },
    { path: '/reservas', name: 'reservas', component: () => import('../views/ReservaView.vue') },
    { path: '/pagos', name: 'pagos', component: () => import('../views/PagoView.vue') },
    { path: '/resenas', name: 'resenas', component: () => import('../views/ResenaView.vue') },
    { path: '/usuarios', name: 'usuarios', component: () => import('../views/UsuarioView.vue') },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login' && token) return '/'
  if (to.path !== '/login' && !token) return '/login'
})

export default router
