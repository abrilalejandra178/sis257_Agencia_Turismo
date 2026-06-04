<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const usuario = ref('')
const contraseña = ref('')
const error = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(usuario.value, contraseña.value).catch(() => (error.value = true))
}
</script>

<template>
  <div class="hero-wrap" style="background-image: url('/images/bg_2.jpg'); position: relative; min-height: 100vh;">
    <div class="overlay"></div>
    <div class="container d-flex align-items-center justify-content-center"
      style="min-height: 100vh; padding-top: 5rem;">
      <div class="login-box">
        <h2 class="text-center text-white mb-4" style="font-family: 'Poppins', sans-serif;">Iniciar Sesión</h2>
        <form @submit.prevent="onSubmit" class="search-property-1">
          <div class="form-group p-3 border-0">
            <label for="usuario" class="text-white">Usuario</label>
            <div class="form-field">
              <div class="icon"><span class="fa fa-user"></span></div>
              <input id="usuario" v-model="usuario" type="text" class="form-control" placeholder="Ingrese su usuario"
                autofocus required>
            </div>
          </div>

          <div class="form-group p-3 border-0">
            <label for="password" class="text-white">Contraseña</label>
            <div class="form-field">
              <div class="icon"><span class="fa fa-lock"></span></div>
              <input id="password" v-model="contraseña" type="password" class="form-control"
                placeholder="Ingrese su contraseña" required>
            </div>
          </div>

          <div v-if="error" class="form-group px-3 border-0 text-center">
            <p class="text-danger bg-white rounded p-2 m-0" style="font-size: 14px; font-weight: bold;">Usuario y/o
              contraseña incorrectos</p>
          </div>

          <div class="form-group p-3 border-0 mt-4">
            <input type="submit" value="Ingresar" class="form-control btn btn-primary py-3 px-5">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-wrap {
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}

.login-box {
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  z-index: 10;
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
}

.login-box label {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 14px;
}
</style>

<style>
/* Unscoped styles to override Bootstrap and template CSS using IDs for maximum specificity */
#usuario, #password {
  color: #ffffff !important;
  caret-color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

#usuario:focus, #password:focus {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: #ffffff !important;
  color: #ffffff !important;
  box-shadow: none !important;
}

#usuario::-webkit-input-placeholder, #password::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #ffffff !important;
  opacity: 1 !important;
}

#usuario:-moz-placeholder, #password:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ffffff !important;
  opacity: 1 !important;
}

#usuario::-moz-placeholder, #password::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ffffff !important;
  opacity: 1 !important;
}

#usuario:-ms-input-placeholder, #password:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ffffff !important;
  opacity: 1 !important;
}

#usuario::-ms-input-placeholder, #password::-ms-input-placeholder {
  /* Microsoft Edge */
  color: #ffffff !important;
  opacity: 1 !important;
}

#usuario::placeholder, #password::placeholder {
  /* Modern Browsers */
  color: #ffffff !important;
  opacity: 1 !important;
}
</style>