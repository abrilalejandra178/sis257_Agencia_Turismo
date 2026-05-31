import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/destinos',
      name: 'destinos',
      component: () => import('../views/DestinoView.vue'),
    },
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
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('../views/ReservaView.vue'),
    },
    {
      path: '/pagos',
      name: 'pagos',
      component: () => import('../views/PagoView.vue'),
    },
    {
      path: '/resenas',
      name: 'resenas',
      component: () => import('../views/ResenaView.vue'),
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuarioView.vue'),
    },
  ],
})

export default router