import type { Usuario } from './usuario'
import type { PaqueteTuristico } from './paquete-turistico'

export interface Reserva {
  id: number
  nombreCliente?: string
  telefonoCliente?: string
  emailCliente?: string
  fechaReserva: Date
  fechaViaje?: Date
  cantidadPersonas: number
  total: number
  adelanto: number
  saldoPendiente: number
  estado: string
  // CAMBIO (requisito #2): motivo de cancelación / baja de la reserva
  motivoCancelacion?: string
  idUsuario: number
  idPaquete: number
  usuario: Usuario
  paquetesTuristicos: PaqueteTuristico
}
