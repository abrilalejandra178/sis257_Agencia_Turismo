<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/index'
const authStore = useAuthStore()
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
    id="ftco-navbar"
  >
    <div class="container">
      <a class="navbar-brand" href="#">🌍 Agencia de Turismo</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav">
        <span class="oi oi-menu"></span> Menu
      </button>
      <div class="collapse navbar-collapse" id="ftco-nav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          </li>
          <template v-if="authStore.token">
            <li class="nav-item">
              <RouterLink to="/destinos" class="nav-link">Destinos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/guias-turisticos" class="nav-link">Guías</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/transportes" class="nav-link">Transportes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/paquetes-turisticos" class="nav-link">Paquetes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/reservas" class="nav-link">Reservas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/pagos" class="nav-link">Pagos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/resenas" class="nav-link">Reseñas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/usuarios" class="nav-link">Usuarios</RouterLink>
            </li>
            <li class="nav-item cta">
              <a class="nav-link" @click="authStore.logout()" style="cursor: pointer">
                <span>Salir</span>
              </a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item cta">
              <RouterLink to="/login" class="nav-link"><span>Registrarse</span></RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

    <RouterView />
</template>

<style scoped></style>
