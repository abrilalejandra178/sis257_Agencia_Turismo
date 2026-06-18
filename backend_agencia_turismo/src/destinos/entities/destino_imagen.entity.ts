import { Destino } from 'src/destinos/entities/destino.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * CAMBIO (requisito #1): nueva tabla 'destino_imagenes' para permitir que
 * un destino tenga varias fotos en una galería, además de la imagen
 * principal que ya existía en el campo 'imagen' de Destino.
 */
@Entity('destino_imagenes')
export class ImagenDestino {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 1000, name: 'url' })
  url: string;

  @Column('int', { name: 'id_destino' })
  idDestino: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Destino, destino => destino.imagenes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_destino', referencedColumnName: 'id' })
  destino: Destino;
}
