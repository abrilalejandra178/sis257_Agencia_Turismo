export interface Itinerario {
  id: number
  dia: number
  titulo: string
  descripcion: string
  horaInicio?: string
  horaFin?: string
  idPaquete: number
  paquete?: { id: number; nombre: string }
}
