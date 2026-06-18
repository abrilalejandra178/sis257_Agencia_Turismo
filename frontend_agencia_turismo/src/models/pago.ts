import type { Reserva } from './reserva'

export interface Pago {
  id: number
  monto: number
  fechaPago: Date
  metodoPago: string
  estadoPago: string
  idReserva: number
  reserva: Reserva
  // CAMBIO (requisito #5): monto entregado por el cliente y cambio/vuelto
  // calculado cuando paga con un monto más elevado al que debía.
  montoRecibido?: number
  cambio?: number
}