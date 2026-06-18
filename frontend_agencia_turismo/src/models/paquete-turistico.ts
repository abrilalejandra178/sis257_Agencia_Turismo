import type { Destino } from './destino'
import type { Extra } from './extra'
import type { GuiaTuristico } from './guia-turistico'
import type { Transporte } from './transporte'

export interface PaqueteTuristico {
  id: number
  nombre: string
  descripción: string
  precio: number
  duración: string
  capacidadMaxima: number
  incluyeHospedaje: string
  incluyeAlimentación: string
  idDestino: number
  idGuia: number
  idTransporte: number
  destino: Destino
  guia: GuiaTuristico
  transporte: Transporte
  extras?: Extra[]
  idsExtras?: number[]
}
