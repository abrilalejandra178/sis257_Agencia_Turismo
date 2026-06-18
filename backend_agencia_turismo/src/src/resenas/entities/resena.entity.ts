import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resenas')
export class Resena {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 500 })
  comentario: string;

  @Column('decimal', { name: 'calificacion', precision: 10, scale: 2 })
  calificacion: number;

  @Column('date', { name: 'fecha' })
  fecha: Date;

  @Column('integer', { name: 'id_usuario' })
  idUsuario: number;

  @Column('integer', { name: 'id_paquete' })
  idPaquete: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.resenas)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => PaquetesTuristico, paquete => paquete.resenas)
  @JoinColumn({ name: 'id_paquete', referencedColumnName: 'id' })
  paquetesTuristicos: PaquetesTuristico;
}
