import { defineStore } from 'pinia'
import http from '@/plugins/axios'

export interface ItemCarrito {
  idPaquete: number
  cantidadPersonas: number
  nombrePaquete?: string
  precio?: number
  subtotal?: number
}

export interface Venta {
  id?: number
  nombreCliente: string
  telefonoCliente?: string
  emailCliente?: string
  items: ItemCarrito[]
  total: number
  adelanto: number
  saldoPendiente: number
  estado?: string
  notas?: string
  metodoPago?: string
  fechaReserva?: Date
}

export interface DetalleVenta {
  id: number
  nombreCliente: string
  paquete: string
  total: number
  adelanto: number
  saldoPendiente: number
  estado: string
  fechaReserva: string
  cantidadPersonas: number
}

export interface ReporteVentas {
  totalVentas: number
  totalPagado: number
  totalPendiente: number
  cantidadReservas: number
  detalleVentas: DetalleVenta[]
}

export const useVentasStore = defineStore('ventas', {
  state: () => ({
    carrito: [] as ItemCarrito[],
    cliente: {
      nombre: '',
      telefono: '',
      email: '',
    },
    notasVenta: '',
    ventaActual: null as Venta | null,
    historialVentas: [] as any[],
    reporteVentas: {
      totalVentas: 0,
      totalPagado: 0,
      totalPendiente: 0,
      cantidadReservas: 0,
      detalleVentas: [] as DetalleVenta[],
    } as ReporteVentas,
  }),

  getters: {
    subtotal: (state) => {
      return state.carrito.reduce((sum, item) => {
        const precio = item.precio || 0
        return sum + precio * item.cantidadPersonas
      }, 0)
    },

    cantidadItems: (state) => state.carrito.length,

    carritoVacio: (state) => state.carrito.length === 0,
  },

  actions: {
    agregarAlCarrito(item: ItemCarrito) {
      const existe = this.carrito.findIndex(
        (p) => p.idPaquete === item.idPaquete
      )

      if (existe !== -1) {
        const existingItem = this.carrito[existe]
        if (existingItem) {
          existingItem.cantidadPersonas += item.cantidadPersonas
        }
      } else {
        this.carrito.push(item)
      }
    },

    eliminarDelCarrito(idPaquete: number) {
      this.carrito = this.carrito.filter((item) => item.idPaquete !== idPaquete)
    },

    actualizarCantidad(idPaquete: number, cantidad: number) {
      const item = this.carrito.find((p) => p.idPaquete === idPaquete)
      if (item && cantidad > 0) {
        item.cantidadPersonas = cantidad
      }
    },

    vaciarCarrito() {
      this.carrito = []
      this.cliente = { nombre: '', telefono: '', email: '' }
      this.notasVenta = ''
    },

    async crearVenta(fechaViaje?: string) {
      try {
        if (this.carrito.length === 0) {
          throw new Error('El carrito está vacío')
        }

        if (!this.cliente.nombre.trim()) {
          throw new Error('Debe ingresar el nombre del cliente')
        }

        const payload = {
          nombreCliente: this.cliente.nombre,
          telefonoCliente: this.cliente.telefono,
          emailCliente: this.cliente.email,
          items: this.carrito,
          notas: this.notasVenta,
          fechaViaje: fechaViaje || undefined,
        }

        const response = await http.post('/ventas', payload)
        this.ventaActual = response.data
        return response.data
      } catch (error) {
        console.error('Error creando venta:', error)
        throw error
      }
    },

    async confirmarPago(idReserva: number, metodoPago: string, referenciaPago?: string) {
      try {
        const payload = {
          metodoPago,
          referenciaPago,
        }

        const response = await http.post(`/ventas/${idReserva}/confirmar-pago`, payload)
        return response.data
      } catch (error) {
        console.error('Error confirmando pago:', error)
        throw error
      }
    },

    async obtenerVentas(filtro?: string) {
      try {
        const params = filtro ? { filtro } : {}
        const response = await http.get('/ventas', { params })
        this.historialVentas = response.data
        return response.data
      } catch (error) {
        console.error('Error obteniendo ventas:', error)
        throw error
      }
    },

    async obtenerReporte(filtro?: string) {
      try {
        const params = filtro ? { filtro } : {}
        const response = await http.get('/ventas/reporte/resumen', { params })
        this.reporteVentas = response.data
        return response.data
      } catch (error) {
        console.error('Error obteniendo reporte:', error)
        throw error
      }
    },

    async cancelarReserva(idReserva: number) {
      try {
        const response = await http.patch(`/ventas/${idReserva}/cancelar`, {})
        return response.data
      } catch (error) {
        console.error('Error cancelando reserva:', error)
        throw error
      }
    },
  },
})
