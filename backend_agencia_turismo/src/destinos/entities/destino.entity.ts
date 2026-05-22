import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 10000 })
  descripción: string;

  @Column('varchar', { length: 10000})
  ubicación: string;

  @Column('varchar', { length: 10000 })
  imagen: string;

}