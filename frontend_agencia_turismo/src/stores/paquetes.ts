import { defineStore } from 'pinia'
import http from '@/plugins/axios'

export interface Paquete {
  id: number
  nombre: string
  descripción: string
  precio: number
  duración: string
  capacidadMaxima: number
  incluyeHospedaje: string
  incluyeAlimentacion: string
  destino?: any
  guia?: any
  transporte?: any
}

export const usePaquetesStore = defineStore('paquetes', {
  state: () => ({
    paquetes: [] as Paquete[],
    paqueteSeleccionado: null as Paquete | null,
    cargando: false,
    error: null as string | null,
  }),

  getters: {
    paquetesDisponibles: (state) => state.paquetes,
  },

  actions: {
    async obtenerPaquetes() {
      this.cargando = true
      this.error = null
      try {
        const response = await http.get('/paquetes-turisticos')
        this.paquetes = response.data
        return response.data
      } catch (error) {
        this.error = 'Error obteniendo paquetes'
        console.error('Error:', error)
        throw error
      } finally {
        this.cargando = false
      }
    },

    async obtenerPaquete(id: number) {
      try {
        const response = await http.get(`/paquetes-turisticos/${id}`)
        this.paqueteSeleccionado = response.data
        return response.data
      } catch (error) {
        this.error = 'Error obteniendo paquete'
        console.error('Error:', error)
        throw error
      }
    },

    buscarPaquetes(termino: string) {
      if (!termino) {
        return this.paquetes
      }

      return this.paquetes.filter((p) =>
        p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        p.descripción.toLowerCase().includes(termino.toLowerCase())
      )
    },
  },
})
