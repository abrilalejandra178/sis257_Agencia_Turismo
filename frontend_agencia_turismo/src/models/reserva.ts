import type { Usuario } from './usuario'
import type { PaqueteTuristico } from './paquete-turistico'
import type { Extra } from './extra'

export interface Reserva {
  id: number
  nombreCliente?: string
  telefonoCliente?: string
  emailCliente?: string
  fechaReserva: Date
  fechaViaje?: Date
  cantidadPersonas: number
  total: number
  estado: string
  idUsuario: number
  idPaquete: number
  idCliente?: number
  usuario: Usuario
  paquetesTuristicos: PaqueteTuristico
  extras?: Extra[]
  idsExtras?: number[]
}
