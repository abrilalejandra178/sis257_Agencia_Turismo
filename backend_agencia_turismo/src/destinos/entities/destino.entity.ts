import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 10000, name: 'descripcion' })
  descripción: string;

  @Column('varchar', { length: 10000, name: 'ubicacion' })
  ubicación: string;

  @Column('varchar', { length: 10000 })
  imagen: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => PaquetesTuristico, paquete => paquete.destino) 
  paquetesTuristicos: PaquetesTuristico[];
}
