import type { Reserva } from './reserva'

export interface Pago {
  id: number
  monto: number
  fechaPago: Date
  metodoPago: string
  estadoPago: string
  idReserva: number
  reserva: Reserva
}