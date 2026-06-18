import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import type { Cliente } from '@/models/cliente'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [] as Cliente[],
    cargando: false,
    error: '',
  }),

  actions: {
    async buscarClientes(query: string) {
      if (!query || query.length < 2) return []
      try {
        const response = await http.get('/clientes', { params: { search: query } })
        return response.data as Cliente[]
      } catch (error) {
        console.error('Error buscando clientes:', error)
        return []
      }
    },

    async obtenerClientes() {
      this.cargando = true
      this.error = ''
      try {
        const response = await http.get('/clientes')
        this.clientes = response.data
      } catch {
        this.error = 'Error cargando clientes'
      } finally {
        this.cargando = false
      }
    },
  },
})
