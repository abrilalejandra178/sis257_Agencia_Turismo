import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transportes')
export class Transporte {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  tipo: string;

  @Column('varchar', { length: 500 })
  empresa: string;

  @Column('varchar', { length: 1000 })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => PaquetesTuristico, paquete => paquete.transporte)
  paquetesTuristicos: PaquetesTuristico[];
}

