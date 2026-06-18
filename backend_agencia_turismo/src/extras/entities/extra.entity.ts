import { TipoExtra } from 'src/enums/tipo-extra.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('extras')
export class Extra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 1000, nullable: true })
  descripcion?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({
    type: 'enum',
    enum: TipoExtra,
  })
  tipo: TipoExtra;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
}
