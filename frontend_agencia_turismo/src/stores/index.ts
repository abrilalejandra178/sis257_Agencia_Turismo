import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    // CAMBIO: el usuario es un objeto ({ nombre, apellido, rol, ... }), no
    // un texto plano. Antes se guardaba como string y al recargar la
    // página quedaba como "[object Object]", rompiendo el nombre/rol
    // mostrados en el panel.
    user: JSON.parse(sessionStorage.getItem('user') || 'null') as {
      nombre?: string
      apellido?: string
      rol?: string
    } | null,
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

        sessionStorage.setItem('user', JSON.stringify(this.user))
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