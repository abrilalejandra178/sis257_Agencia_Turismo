import { Pago } from 'src/pagos/entities/pago.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  // CAMBIO: nuevo estado para cuando el cliente ya dejó un adelanto
  // pero todavía no cubre el total de la reserva.
  ADELANTADO = 'adelantado',
  PAGADA = 'pagada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100, name: 'nombre_cliente' })
  nombreCliente: string;

  @Column('varchar', { length: 20, name: 'telefono_cliente', nullable: true })
  telefonoCliente?: string;

  @Column('varchar', { length: 100, name: 'email_cliente', nullable: true })
  emailCliente?: string;

  @Column('date', { name: 'fecha_reserva' })
  fechaReserva: Date;

  @Column('date', { name: 'fecha_viaje', nullable: true })
  fechaViaje: Date;

  @Column('int', { name: 'cantidad_personas' })
  cantidadPersonas: number;

  @Column('decimal', { name: 'total', precision: 10, scale: 2 })
  total: number;

  @Column('decimal', { name: 'adelanto', precision: 10, scale: 2, default: 0 })
  adelanto: number;

  @Column('decimal', { name: 'saldo_pendiente', precision: 10, scale: 2 })
  saldoPendiente: number;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
    name: 'estado',
  })
  estado: EstadoReserva;

  @Column('varchar', { length: 255, name: 'notas', nullable: true })
  notas?: string;

  // CAMBIO (requisito #2): motivo por el cual una reserva fue cancelada
  // o dada de baja (eliminada). Se guarda al cancelar o al eliminar.
  @Column('varchar', { length: 255, name: 'motivo_cancelacion', nullable: true })
  motivoCancelacion?: string;

  @Column('int', { name: 'id_usuario', nullable: true })
  idUsuario: number;

  @Column('int', { name: 'id_paquete' })
  idPaquete: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.reservas, { nullable: true })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => PaquetesTuristico, paquete => paquete.reservas)
  @JoinColumn({ name: 'id_paquete', referencedColumnName: 'id' })
  paquetesTuristicos: PaquetesTuristico;

  @OneToMany(() => Pago, pago => pago.reserva, { cascade: true })
  pagos: Pago[];
}
