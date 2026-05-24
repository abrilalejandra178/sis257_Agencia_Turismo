import { join } from 'path';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('decimal', { name: 'total', precision: 10, scale: 2 })
  monto: number;

  @Column('date', { name: 'fecha_pago' })
  fechaPago: Date;

  @Column('varchar', { length: 100 })
  metodoPago: string;

  @Column('varchar', { length: 100 })
  estadoPago: string;

  @Column('int', { name: 'id_reserva' })
  idReserva: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Reserva, reserva => reserva.pagos)
  @JoinColumn({ name: 'id_reserva', referencedColumnName: 'id' })
  reserva: Reserva;
}
