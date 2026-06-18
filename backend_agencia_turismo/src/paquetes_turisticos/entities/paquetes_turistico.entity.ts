import { Destino } from 'src/destinos/entities/destino.entity';
import { GuiaTuristico } from 'src/guias_turisticos/entities/guias_turistico.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Resena } from 'src/resenas/entities/resena.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';
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

@Entity('paquetes_turisticos')
export class PaquetesTuristico {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 500, name: 'descripcion' })
  descripción: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('varchar', { length: 1000, name: 'duracion' })
  duración: string;

  @Column('integer', { name: 'capacidad_maxima' })
  capacidadMaxima: number;

  @Column('varchar', { length: 100, name: 'incluye_hospedaje' })
  incluyeHospedaje: string;

  @Column('varchar', { length: 100, name: 'incluye_alimentacion' })
  incluyeAlimentación: string;

  @Column('integer', { name: 'id_destino' })
  idDestino: number;

  @Column('integer', { name: 'id_guia' })
  idGuia: number;

  @Column('integer', { name: 'id_transporte' })
  idTransporte: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Destino, (destino) => destino.paquetesTuristicos)
  @JoinColumn({ name: 'id_destino', referencedColumnName: 'id' })
  destino: Destino;

  @ManyToOne(() => GuiaTuristico, (guia) => guia.paquetesTuristicos)
  @JoinColumn({ name: 'id_guia', referencedColumnName: 'id' })
  guia: GuiaTuristico;

  @ManyToOne(() => Transporte, (transporte) => transporte.paquetesTuristicos)
  @JoinColumn({ name: 'id_transporte', referencedColumnName: 'id' })
  transporte: Transporte;

  @OneToMany(() => Reserva, (reserva) => reserva.paquetesTuristicos)
  reservas: Reserva[];

  @OneToMany(() => Resena, (resena) => resena.paquetesTuristicos)
  resenas: Resena[];
}
