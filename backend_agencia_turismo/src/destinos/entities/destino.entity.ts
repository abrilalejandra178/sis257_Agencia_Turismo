import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DestinoImagen } from './destino_imagen.entity'
import { PaquetesTuristico } from '../../paquetes_turisticos/entities/paquetes_turistico.entity'

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column()
  descripción: string

  @Column()
  ubicación: string

  @OneToMany(
    () => PaquetesTuristico,
    (paquete) => paquete.destino,
  )
  paquetesTuristicos: PaquetesTuristico[];

  @OneToMany(() => DestinoImagen, (img) => img.destino, {
    cascade: true,
    eager: true,
  })
  imagenes: DestinoImagen[]
}