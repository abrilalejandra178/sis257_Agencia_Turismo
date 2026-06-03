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
  <div class="my-5 pt-5">
    <h1 class="text-center">Iniciar Sesión</h1>
    <form class="form" @submit.prevent="onSubmit">
      <label class="form-label">Nombre:</label>
      <input v-model="nombre" type="text" class="form-input" placeholder="Nombre" autofocus />

      <label class="form-label">Contraseña:</label>
      <input v-model="contraseña" type="password" class="form-input" placeholder="Contraseña" />

      <p v-if="error" class="text-danger">Nombre y/o contraseña incorrectos</p>
      <input type="submit" class="form-submit" value="Ingresar" />
    </form>
  </div>
</template>

<style scoped>
.text-center { text-align: center; }
.text-danger { color: #ef4444; text-align: center; margin-top: 0.5rem; }
.my-5 { margin-top: 3rem; }
.pt-5 { padding-top: 2rem; }

.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 10px 15px;
  background: none;
  border: 1px solid white;
  color: white;
}

.form-submit {
  background: #2563a8;
  border: none;
  border-radius: 5rem;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}

.form-submit:hover {
  background: #1a3a5c;
}
</style>