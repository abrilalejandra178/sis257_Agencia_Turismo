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

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('date', { name: 'fecha_reserva' })
  fechaReserva: Date;

  @Column('int', { name: 'cantidad_personas' })
  cantidadPersonas: number;

  @Column('decimal', { name: 'total', precision: 10, scale: 2 })
  total: number;

  @Column('decimal', { name: 'adelanto', precision: 10, scale: 2 })
  adelanto: number;

  @Column('decimal', { name: 'saldo_pendiente', precision: 10, scale: 2 })
  saldoPendiente: number;

  @Column('varchar', { name: 'estado', length: 50 })
  estado: string;

  @Column('int', { name: 'id_usuario' })
  idUsuario: number;

  @Column('int', { name: 'id_paquete' })
  idPaquete: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => PaquetesTuristico, paquete => paquete.reservas)
  @JoinColumn({ name: 'id_paquete', referencedColumnName: 'id' })
  paquetesTuristicos: PaquetesTuristico;

  @OneToMany(() => Pago, pago => pago.reserva)
  pagos: Pago[];

}
