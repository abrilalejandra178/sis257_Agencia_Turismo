import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
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

@Entity('itinerarios')
export class Itinerario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('int', { name: 'dia' })
  dia: number;

  @Column('varchar', { length: 100, name: 'titulo' })
  titulo: string;

  @Column('varchar', { length: 2000, name: 'descripcion' })
  descripcion: string;

  @Column('varchar', { length: 10, name: 'hora_inicio', nullable: true })
  horaInicio?: string;

  @Column('varchar', { length: 10, name: 'hora_fin', nullable: true })
  horaFin?: string;

  @Column('int', { name: 'id_paquete' })
  idPaquete: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => PaquetesTuristico, paquete => paquete.itinerarios)
  @JoinColumn({ name: 'id_paquete', referencedColumnName: 'id' })
  paquete: PaquetesTuristico;
}
