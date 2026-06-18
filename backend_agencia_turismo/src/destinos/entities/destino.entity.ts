<<<<<<< HEAD
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { ImagenDestino } from './imagen-destino.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
=======
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DestinoImagen } from './destino_imagen.entity'
import { PaquetesTuristico } from '../../paquetes_turisticos/entities/paquetes_turistico.entity'
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e

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

<<<<<<< HEAD
  // CAMBIO (requisito #1): galería de imágenes adicionales del destino.
  // orphanedRowAction: 'delete' permite que al guardar un nuevo arreglo de
  // imágenes, las que ya no estén en la lista se eliminen automáticamente.
  @OneToMany(() => ImagenDestino, imagen => imagen.destino, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  imagenes: ImagenDestino[];
}
=======
  @OneToMany(() => DestinoImagen, (img) => img.destino, {
    cascade: true,
    eager: true,
  })
  imagenes: DestinoImagen[]
}
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
