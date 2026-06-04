<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/index'
import { ref, computed } from 'vue'
import Menu from 'primevue/menu'
import AdminLayout from '@/layouts/AdminLayout.vue'

const authStore = useAuthStore()
const route = useRoute()

const menu = ref();
const items = ref([
  { label: 'Destinos', icon: 'pi pi-map-marker', route: '/destinos' },
  { label: 'Guías Turísticos', icon: 'pi pi-users', route: '/guias-turisticos' },
  { label: 'Transportes', icon: 'pi pi-car', route: '/transportes' },
  { label: 'Paquetes Turísticos', icon: 'pi pi-briefcase', route: '/paquetes-turisticos' },
  { label: 'Reservas', icon: 'pi pi-calendar', route: '/reservas' },
  //{ label: 'Pagos', icon: 'pi pi-credit-card', route: '/pagos' },
  { label: 'Reseñas', icon: 'pi pi-star', route: '/resenas' },
  { label: 'Usuarios', icon: 'pi pi-user', route: '/usuarios' }
]);

const adminRoutes = ['/dashboard', '/destinos', '/usuarios', '/reservas', '/guias-turisticos', '/transportes', '/paquetes-turisticos', '/resenas'];

const isAdminRoute = computed(() => adminRoutes.includes(route.path));
const isLoginRoute = computed(() => route.path === '/login');
const isPublicRoute = computed(() => !isAdminRoute.value && !isLoginRoute.value);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <!-- ========== RUTAS ADMIN ========== -->
  <AdminLayout v-if="isAdminRoute">
    <RouterView />
  </AdminLayout>

  <!-- ========== LOGIN ========== -->
  <RouterView v-else-if="isLoginRoute" />

  <!-- ========== RUTAS PÚBLICAS (Home, Landing, etc.) ========== -->
  <template v-else>
    <!-- Navbar Bootstrap de la plantilla original -->
    <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">Pacific<span>Travel Agency</span></RouterLink>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="oi oi-menu"></span> Menu
        </button>

        <div class="collapse navbar-collapse" id="ftco-nav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active"><RouterLink to="/" class="nav-link">Home</RouterLink></li>
            <template v-if="authStore.token">
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                  Administración <span class="fa fa-angle-down ml-1"></span>
                </a>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                  <template #item="{ item, props }">
                    <RouterLink v-if="item.route" :to="item.route" custom v-slot="{ navigate, href }">
                      <a :href="href" @click="navigate" v-bind="props.action">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                      </a>
                    </RouterLink>
                  </template>
                </Menu>
              </li>
              <li class="nav-item"><RouterLink to="/dashboard" class="nav-link">Panel Admin</RouterLink></li>
              <li class="nav-item"><a @click="authStore.logout()" class="nav-link" style="cursor:pointer">Salir</a></li>
            </template>
            <template v-else>
              <li class="nav-item"><RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink></li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>

    <!-- Footer de la plantilla original -->
    <footer class="ftco-footer bg-bottom ftco-no-pt" style="background-image: url(/images/bg_3.jpg);">
      <div class="container">
        <div class="row mb-5">
          <div class="col-md pt-5">
            <div class="ftco-footer-widget pt-md-5 mb-4">
              <h2 class="ftco-heading-2">About</h2>
              <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
              <ul class="ftco-footer-social list-unstyled float-md-left float-lft">
                <li class="ftco-animate"><a href="#"><span class="fa fa-twitter"></span></a></li>
                <li class="ftco-animate"><a href="#"><span class="fa fa-facebook"></span></a></li>
                <li class="ftco-animate"><a href="#"><span class="fa fa-instagram"></span></a></li>
              </ul>
            </div>
          </div>
          <div class="col-md pt-5 border-left">
            <div class="ftco-footer-widget pt-md-5 mb-4 ml-md-5">
              <h2 class="ftco-heading-2">Information</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">Online Enquiry</a></li>
                <li><a href="#" class="py-2 d-block">General Enquiries</a></li>
                <li><a href="#" class="py-2 d-block">Booking Conditions</a></li>
                <li><a href="#" class="py-2 d-block">Privacy and Policy</a></li>
                <li><a href="#" class="py-2 d-block">Refund Policy</a></li>
                <li><a href="#" class="py-2 d-block">Call Us</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md pt-5 border-left">
            <div class="ftco-footer-widget pt-md-5 mb-4">
              <h2 class="ftco-heading-2">Experience</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">Adventure</a></li>
                <li><a href="#" class="py-2 d-block">Hotel and Restaurant</a></li>
                <li><a href="#" class="py-2 d-block">Beach</a></li>
                <li><a href="#" class="py-2 d-block">Nature</a></li>
                <li><a href="#" class="py-2 d-block">Camping</a></li>
                <li><a href="#" class="py-2 d-block">Party</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md pt-5 border-left">
            <div class="ftco-footer-widget pt-md-5 mb-4">
              <h2 class="ftco-heading-2">Have a Questions?</h2>
              <div class="block-23 mb-3">
                <ul>
                  <li><span class="icon fa fa-map-marker"></span><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
                  <li><a href="#"><span class="icon fa fa-phone"></span><span class="text">+2 392 3929 210</span></a></li>
                  <li><a href="#"><span class="icon fa fa-paper-plane"></span><span class="text">info@yourdomain.com</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 text-center">
            <p>
              Copyright &copy;2026 All rights reserved | This template is made with <i class="fa fa-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </template>
</template>

<style>
#app {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar personalizada para admin */
.admin-layout ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.admin-layout ::-webkit-scrollbar-track {
  background: transparent;
}

.admin-layout ::-webkit-scrollbar-thumb {
  background: rgba(30, 64, 175, 0.3);
  border-radius: 3px;
}

.admin-layout ::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 64, 175, 0.5);
}
</style>
