export interface ImagenDestino {
  id?: number
  url: string
}

export interface Destino {
  id: number
  nombre: string
  descripción: string
  ubicación: string
  imagen: string
  // CAMBIO (requisito #1): galería de imágenes adicionales del destino.
  imagenes?: ImagenDestino[]
}