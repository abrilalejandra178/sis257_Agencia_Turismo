import type { Usuario } from './usuario'
import type { PaqueteTuristico } from './paquete-turistico'

export interface Resena {
  id: number
  comentario: string
  calificacion: number
  fecha: Date
  idUsuario: number
  idPaquete: number
  usuario: Usuario
  paquetesTuristicos: PaqueteTuristico
}
