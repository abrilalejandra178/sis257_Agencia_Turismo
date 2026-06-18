<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/index'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)

const nombreUsuario = computed(() => {
  return authStore.user?.nombre ? `${authStore.user.nombre} ${authStore.user.apellido || ''}` : 'Administrador'
})

const rolUsuario = computed(() => {
  return authStore.user?.rol || 'ADMIN'
})

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const horaActual = ref('')

function actualizarHora() {
  horaActual.value = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  actualizarHora()
  setInterval(actualizarHora, 1000)
})

function cerrarSesion() {
  authStore.logout()
}

function navegarA(ruta: string) {
  router.push(ruta)
  mobileMenuOpen.value = false
}

const menuSections = [
  {
    title: 'VENTAS',
    items: [
      { label: 'Punto de Venta', icon: 'pi pi-shopping-cart', route: '/dashboard' },
      { label: 'Reservas', icon: 'pi pi-history', route: '/reservas' },
    ],
  },
  {
    title: 'CATÁLOGO',
    items: [
      { label: 'Paquetes', icon: 'pi pi-briefcase', route: '/paquetes-turisticos' },
      { label: 'Destinos', icon: 'pi pi-map-marker', route: '/destinos' },
      { label: 'Guías', icon: 'pi pi-users', route: '/guias-turisticos' },
      { label: 'Transportes', icon: 'pi pi-car', route: '/transportes' },
    ],
  },
  {
    title: 'OPERACIONES',
    items: [
      { label: 'Reseñas', icon: 'pi pi-star', route: '/resenas' },
      { label: 'Itinerarios', icon: 'pi pi-calendar', route: '/itinerarios' },
      { label: 'Extras', icon: 'pi pi-plus-circle', route: '/extras' },
    ],
  },
  {
    title: 'CLIENTES',
    items: [
      { label: 'Clientes', icon: 'pi pi-id-card', route: '/clientes' },
    ],
  },
  {
    title: 'CONFIGURACIÓN',
    items: [
      { label: 'Usuarios', icon: 'pi pi-user', route: '/usuarios' },
    ],
  },
]

function isActive(ruta: string): boolean {
  return route.path === ruta
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo-box">
          <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div v-if="!sidebarCollapsed" class="logo-text">
          <h1>Pacific</h1>
          <span>Travel Agency</span>
        </div>
      </div>

      <!-- Menu -->
      <nav class="sidebar-nav">
        <div v-for="section in menuSections" :key="section.title" class="menu-section">
          <div v-if="!sidebarCollapsed" class="section-title">{{ section.title }}</div>
          <div v-else class="section-divider"></div>
          <div class="section-items">
            <button
              v-for="item in section.items"
              :key="item.route"
              @click="navegarA(item.route)"
              :class="['menu-item', { active: isActive(item.route) }]"
              :title="sidebarCollapsed ? item.label : ''"
            >
              <i :class="item.icon"></i>
              <span v-if="!sidebarCollapsed" class="item-label">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- User Card -->
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div v-if="!sidebarCollapsed" class="user-info">
            <p class="user-name">{{ nombreUsuario }}</p>
            <p class="user-role">{{ rolUsuario }}</p>
          </div>
        </div>
        <button
          @click="navegarA('/')"
          :class="['home-btn', { collapsed: sidebarCollapsed }]"
          title="Ver sitio público"
        >
          <i class="pi pi-globe"></i>
          <span v-if="!sidebarCollapsed">Ver Sitio</span>
        </button>
        <button
          @click="cerrarSesion"
          :class="['logout-btn', { collapsed: sidebarCollapsed }]"
          title="Cerrar sesión"
        >
          <i class="pi pi-sign-out"></i>
          <span v-if="!sidebarCollapsed">Salir</span>
        </button>
      </div>

      <!-- Toggle -->
      <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
      </button>
    </aside>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="mobileMenuOpen = true">
            <i class="pi pi-bars"></i>
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-label">Panel de Administración</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ route.name?.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}</span>
          </div>
        </div>
        <div class="topbar-right">
          <div class="datetime">
            <div class="time">{{ horaActual }}</div>
            <div class="date">{{ fechaHoy }}</div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2a0f08 0%, #3d160b 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: width 0.3s ease;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(241, 93, 48, 0.3);
}

.logo-box {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
  width: 24px;
  height: 24px;
  color: #f15d30;
}

.logo-text h1 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
  color: #ffffff;
}

.logo-text span {
  font-size: 0.7rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.75rem;
}

.menu-section {
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  opacity: 0.5;
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}

.section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.75rem 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.menu-item i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar i {
  font-size: 0.875rem;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.user-role {
  font-size: 0.7rem;
  opacity: 0.6;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #fecaca;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.35);
  color: white;
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: rgba(241, 93, 48, 0.2);
  color: #ffd4c7;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  margin-bottom: 0.5rem;
}

.home-btn:hover {
  background: rgba(241, 93, 48, 0.35);
  color: white;
}

.home-btn.collapsed {
  justify-content: center;
  padding: 0.5rem;
}

.logout-btn.collapsed {
  justify-content: center;
  padding: 0.5rem;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid #f15d30;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f15d30;
  font-size: 0.625rem;
  transition: transform 0.2s ease;
  z-index: 101;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed + .main-wrapper {
  margin-left: 70px;
}

/* Topbar */
.topbar {
  background: white;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #374151;
  cursor: pointer;
  padding: 0.25rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-label {
  color: #9ca3af;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 600;
  text-transform: capitalize;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.datetime {
  text-align: right;
}

.time {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f15d30;
  line-height: 1;
}

.date {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
  margin-top: 0.125rem;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-x: auto;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px !important;
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }

  .main-wrapper {
    margin-left: 0 !important;
  }

  .mobile-menu-btn {
    display: block;
  }

  .sidebar-toggle {
    display: none;
  }

  .mobile-overlay {
    display: block;
  }
}

@media (max-width: 640px) {
  .topbar {
    padding: 0.75rem 1rem;
  }

  .breadcrumb {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>

<style>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.app-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.app-btn-primary {
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
}
.app-btn-primary:hover {
  box-shadow: 0 4px 12px rgba(241, 93, 48, 0.3);
}
.app-btn-secondary {
  background: #f3f4f6;
  color: #374151;
}
.app-btn-secondary:hover {
  background: #e5e7eb;
}
.app-btn-danger {
  background: #fef2f2;
  color: #dc2626;
}
.app-btn-danger:hover {
  background: #fee2e2;
}
.search-box {
  margin-bottom: 1rem;
}
</style>
