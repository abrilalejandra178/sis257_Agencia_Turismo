import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guias_turisticos')
export class GuiaTuristico {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellido: string;

  @Column('varchar', { length: 8, name: 'telefono' })
  teléfono: string;

  @Column('varchar', { length: 1000 })
  idioma: string;

  @Column('varchar', { length: 10000 })
  experiencia: string;

  // CAMBIO (requisito #4): la calificación del guía ahora es un entero
  // del 1 al 5 (sistema de estrellas), antes era decimal sin límite real.
  @Column('int', { name: 'calificacion' })
  calificación: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => PaquetesTuristico, paquete => paquete.guia)
  paquetesTuristicos: PaquetesTuristico[];
}
