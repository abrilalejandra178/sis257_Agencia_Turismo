import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: sessionStorage.getItem('user') || '',
    token: sessionStorage.getItem('token') || '',
    returnUrl: '',
  }),

  actions: {
    async login(usuario: string, clave: string) {
      console.log('ENVIANDO LOGIN:', {
        usuario,
        clave,
      })

      try {
        const response = await http.post('auth/login', {
          usuario,
          clave,
        })

        console.log('RESPUESTA:', response.data)

        this.user = response.data.usuario
        this.token = response.data.access_token

        sessionStorage.setItem('user', this.user || '')
        sessionStorage.setItem('token', this.token || '')

        router.push(this.returnUrl || '/')
      } catch (error) {
        console.error('ERROR LOGIN:', error)
        throw error
      }
    },

    logout() {
      sessionStorage.clear()
      this.$reset()
      router.push('/login')
    },
  },
})

export { useAuthStore }