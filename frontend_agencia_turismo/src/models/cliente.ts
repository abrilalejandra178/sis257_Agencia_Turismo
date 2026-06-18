export interface Cliente {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono?: string
  documento?: string
  fechaRegistro?: Date
}
