import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Destino } from './destino.entity'

@Entity('destino_imagenes')
export class DestinoImagen {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  urlImagen: string

  @ManyToOne(() => Destino, (destino) => destino.imagenes, {
    onDelete: 'CASCADE',
  })
  destino: Destino
}