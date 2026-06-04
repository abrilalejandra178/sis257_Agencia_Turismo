<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const nombre = ref('')
const contraseña = ref('')
const error = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(nombre.value, contraseña.value).catch(() => (error.value = true))
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      width: 100vw;
      background-image: url('/images/bg_1.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    "
  >
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      "
    ></div>

    <div
      style="
        position: relative;
        z-index: 1;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        padding: 3rem 2.5rem;
        width: 420px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      "
    >
      <div style="text-align: center; margin-bottom: 2rem">
        <h2 style="color: white; font-size: 1.5rem; font-weight: 500; margin-bottom: 0.5rem">
          🌍 Agencia de Turismo
        </h2>
        <p style="color: rgba(255, 255, 255, 0.75); font-size: rem">Inicia sesión</p>
      </div>

      <form @submit.prevent="onSubmit">
        <div style="margin-bottom: 1.2rem">
          <label style="color: white; font-weight: 600; display: block; margin-bottom: 0.5rem"
            >Nombre</label
          >
          <input
            v-model="nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            autofocus
            style="
              width: 100%;
              padding: 0.75rem 1rem;
              border-radius: 8px;
              border: 1.5px solid rgba(255, 255, 255, 0.3);
              background: rgba(255, 255, 255, 0.15);
              color: black;
              font-size: 0.95rem;
              outline: none;
              box-sizing: border-box;
            "
          />
        </div>

        <div style="margin-bottom: 1.2rem">
          <label style="color: white; font-weight: 600; display: block; margin-bottom: 0.5rem"
            >Contraseña</label
          >
          <input
            v-model="contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            style="
              width: 100%;
              padding: 0.75rem 1rem;
              border-radius: 8px;
              border: 1.5px solid rgba(255, 255, 255, 0.3);
              background: rgba(255, 255, 255, 0.15);
              color: black;
              font-size: 0.95rem;
              outline: none;
              box-sizing: border-box;
            "
          />
        </div>

        <p v-if="error" style="color: red; text-align: center; margin-bottom: 1rem">
          Nombre y/o contraseña incorrectos
        </p>

        <button
          type="submit"
          style="
            width: 100%;
            padding: 0.85rem;
            background: #f96d00;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            margin-top: 0.5rem;
            cursor: pointer;
          "
        >
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
