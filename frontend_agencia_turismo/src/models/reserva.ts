import type { Usuario } from './usuario'
import type { PaqueteTuristico } from './paquete-turistico'

export interface Reserva {
  id: number
  fechaReserva: Date
  cantidadPersonas: number
  total: number
  adelanto: number
  saldoPendiente: number
  estado: string
  idUsuario: number
  idPaquete: number
  usuario: Usuario
  paquetesTuristicos: PaqueteTuristico
}