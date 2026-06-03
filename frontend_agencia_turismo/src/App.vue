<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/index'
const authStore = useAuthStore()
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <h2>🌍 Agencia de Turismo</h2>
      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <span v-if="authStore.token">
          <RouterLink to="/destinos">Destinos</RouterLink>
          <RouterLink to="/guias-turisticos">Guías Turísticos</RouterLink>
          <RouterLink to="/transportes">Transportes</RouterLink>
          <RouterLink to="/paquetes-turisticos">Paquetes Turísticos</RouterLink>
          <RouterLink to="/reservas">Reservas</RouterLink>
          <RouterLink to="/pagos">Pagos</RouterLink>
          <RouterLink to="/resenas">Reseñas</RouterLink>
          <RouterLink to="/usuarios">Usuarios</RouterLink>
          <a @click="authStore.logout()" class="link-salir">Salir</a>
        </span>
        <span v-else>
          <RouterLink to="/login">Iniciar Sesión</RouterLink>
        </span>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a, .link-salir {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  cursor: pointer;
}
nav a:first-of-type {
  border: 0;
}
.link-salir {
  color: #ef4444;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  .logo {
    margin: 0 2rem 0 0;
  }
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>