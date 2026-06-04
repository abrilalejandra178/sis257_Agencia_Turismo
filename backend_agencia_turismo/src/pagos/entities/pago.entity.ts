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

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PROCESANDO = 'procesando',
  COMPLETADO = 'completado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TARJETA_CREDITO = 'tarjeta_credito',
  TARJETA_DEBITO = 'tarjeta_debito',
  TRANSFERENCIA = 'transferencia',
  CHEQUE = 'cheque',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('decimal', { name: 'total', precision: 10, scale: 2 })
  monto: number;

  @Column('date', { name: 'fecha_pago', nullable: true })
  fechaPago: Date;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO,
    name: 'metodo_pago',
  })
  metodoPago: MetodoPago;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE,
    name: 'estado_pago',
  })
  estadoPago: EstadoPago;

  @Column('varchar', { length: 255, name: 'referencia_pago', nullable: true })
  referenciaPago?: string;

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
