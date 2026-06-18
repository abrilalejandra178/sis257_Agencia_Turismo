import { EstadoReserva } from 'src/enums/estado-reserva.enum';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Extra } from 'src/extras/entities/extra.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
    name: 'estado',
  })
  estado: EstadoReserva;

  @Column('varchar', { length: 255, name: 'notas', nullable: true })
  notas?: string;

  @Column('varchar', { length: 500, name: 'motivo_cancelacion', nullable: true })
  motivoCancelacion?: string;

  @Column('int', { name: 'id_usuario', nullable: true })
  idUsuario: number;

  @Column('int', { name: 'id_paquete' })
  idPaquete: number;

  @Column('int', { name: 'id_cliente', nullable: true })
  idCliente?: number;

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

  @ManyToOne(() => Cliente, cliente => cliente.reservas, { nullable: true })
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente?: Cliente;

  @OneToMany(() => Pago, pago => pago.reserva, { cascade: true })
  pagos: Pago[];

  @ManyToMany(() => Extra)
  @JoinTable({ name: 'reserva_extra' })
  extras: Extra[];
}
