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

  // CAMBIO (requisito #5): si el cliente paga con un monto más elevado al
  // que debía (por ejemplo, pago en efectivo), se guarda cuánto entregó
  // y cuánto cambio/vuelto se le devolvió.
  @Column('decimal', { precision: 10, scale: 2, name: 'monto_recibido', nullable: true })
  montoRecibido?: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'cambio', default: 0 })
  cambio: number;

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
