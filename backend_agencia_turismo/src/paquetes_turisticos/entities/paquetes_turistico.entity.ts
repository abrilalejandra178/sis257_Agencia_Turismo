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

  @Column('varchar', { length: 500 })
  descripción: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('varchar', { length: 1000 })
  duración: string;

  @Column('integer')
  capacidadMaxima: number;

  @Column('varchar', { length: 100 })
  incluyeHospedaje: string;

  @Column('varchar', { length: 100 })
  incluyeAlimentación: string;

  @Column('integer')
  idDestino: number;

  @Column('integer')
  idGuia: number;

  @Column('integer')
  idTransporte: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Destino, destino => destino.paquetesTuristicos)
  @JoinColumn({ name: 'idDestino', referencedColumnName: 'id' })
  destino: Destino;

  @ManyToOne(() => GuiaTuristico, guia => guia.paquetesTuristicos)
  @JoinColumn({ name: 'idGuia', referencedColumnName: 'id' })
  guia: GuiaTuristico;

  @ManyToOne(() => Transporte, transporte => transporte.paquetesTuristicos)
  @JoinColumn({ name: 'idTransporte', referencedColumnName: 'id' })
  transporte: Transporte;

  @OneToMany(() => Reserva, reserva => reserva.paquetesTuristicos)
  reservas: Reserva[];

  @OneToMany(() => Resena, resena => resena.paquetesTuristicos)
  resenas: Resena[];
}
