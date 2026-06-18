import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import type { Destino } from '@/models/destino'
import type { PaqueteTuristico } from '@/models/paquete-turistico'

export const useHomeStore = defineStore('home', {
  state: () => ({
    destinos: [] as Destino[],
    paquetes: [] as PaqueteTuristico[],
    cargando: false,
    error: '',
  }),

  getters: {
    destinosDestacados: (state) => state.destinos.slice(0, 6),
    paquetesDestacados: (state) => state.paquetes.slice(0, 6),
  },

  actions: {
    async cargarDatosHome() {
      this.cargando = true
      this.error = ''
      try {
        const [destinosRes, paquetesRes] = await Promise.all([
          http.get('/destinos'),
          http.get('/paquetes-turisticos'),
        ])
        this.destinos = destinosRes.data
        this.paquetes = paquetesRes.data
      } catch (error) {
        this.error = 'Error cargando contenido del home'
        console.error('Error cargando home:', error)
      } finally {
        this.cargando = false
      }
    },

    paquetesFiltrados(termino: string) {
      if (!termino) return this.paquetes
      const q = termino.toLowerCase()
      return this.paquetes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripción.toLowerCase().includes(q) ||
          p.destino?.nombre.toLowerCase().includes(q),
      )
    },
  },
})
