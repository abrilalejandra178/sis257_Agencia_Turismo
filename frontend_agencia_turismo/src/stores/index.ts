import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    token: localStorage.getItem('token') || '',
    returnUrl: '',
  }),
  actions: {
    async login(usuario: string, contraseña: string) {
      try {
        const response = await http.post('auth/login', { usuario, clave: contraseña })
        const { access_token, token, ...userData } = response.data

        this.user = userData
        this.token = access_token || token

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        router.push(this.returnUrl || '/')
      } catch (error) {
        throw error
      }
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$reset()
      router.push('/')
    },
  },
})

export { useAuthStore }