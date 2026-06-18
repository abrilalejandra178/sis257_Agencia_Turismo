import { Reserva } from 'src/reservas/entities/reserva.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellido: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Column('varchar', { length: 20, name: 'telefono', nullable: true })
  telefono?: string;

  @Column('varchar', { length: 20, name: 'documento', nullable: true })
  documento?: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Reserva, reserva => reserva.cliente)
  reservas: Reserva[];
}
