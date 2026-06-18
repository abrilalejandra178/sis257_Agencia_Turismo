export interface GuiaTuristico {
  id: number
  nombre: string
  apellido: string
  teléfono: string
  idioma: string
  experiencia: string
  // CAMBIO (requisito #4): calificación entera del 1 al 5 (estrellas)
  calificación: number
}
