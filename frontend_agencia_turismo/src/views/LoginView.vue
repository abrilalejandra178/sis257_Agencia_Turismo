<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/index'

const router = useRouter()
const usuario = ref('')
const contraseña = ref('')
const error = ref('')
const cargando = ref(false)

async function onSubmit() {
  if (!usuario.value.trim() || !contraseña.value) {
    error.value = 'Por favor complete todos los campos'
    return
  }

  cargando.value = true
  error.value = ''

  try {
    const authStore = useAuthStore()
    await authStore.login(usuario.value, contraseña.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Usuario y/o contraseña incorrectos'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg-image"></div>
    <div class="login-overlay"></div>

    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="login-title">Pacific Travel Agency</h1>
          <p class="login-subtitle">Sistema de Ventas</p>
        </div>

        <div class="login-body">
          <div v-if="error" class="login-error">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            {{ error }}
          </div>

          <form @submit.prevent="onSubmit" class="login-form">
            <div class="form-group">
              <label for="login-usuario" class="form-label">Usuario</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
                <input
                  id="login-usuario"
                  v-model="usuario"
                  type="text"
                  placeholder="Ingrese su usuario"
                  class="form-input"
                  :disabled="cargando"
                  autofocus
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label">Contraseña</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                <input
                  id="login-password"
                  v-model="contraseña"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  class="form-input"
                  :disabled="cargando"
                  required
                />
              </div>
            </div>

            <button type="submit" :disabled="cargando" class="login-btn">
              <svg v-if="cargando" class="spinner" fill="none" viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            </button>
          </form>

          <div class="login-footer-text">
            <p>Sistema de gestión de ventas para Pacific Travel Agency</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.login-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/images/bg_1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(42, 15, 8, 0.92) 0%, rgba(61, 22, 11, 0.88) 50%, rgba(74, 31, 18, 0.85) 100%);
}

.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.login-header {
  background: linear-gradient(135deg, #c73e1e 0%, #f15d30 100%);
  padding: 2.5rem 2rem;
  text-align: center;
}

.login-logo {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #f15d30;
}

.login-title {
  color: white;
  font-size: 1.875rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.025em;
}

.login-subtitle {
  color: #ffe8e0;
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

.login-body {
  padding: 2rem;
}

.login-error {
  margin-bottom: 1rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #2d1810;
  background: white;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  border-color: #f15d30;
  box-shadow: 0 0 0 3px rgba(241, 93, 48, 0.15);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #c73e1e 0%, #f15d30 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px -5px rgba(199, 62, 30, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

.spinner-track {
  opacity: 0.25;
}

.spinner-fill {
  opacity: 0.75;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-footer-text {
  margin-top: 1.5rem;
  text-align: center;
}

.login-footer-text p {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8125rem;
  margin-top: 1.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
