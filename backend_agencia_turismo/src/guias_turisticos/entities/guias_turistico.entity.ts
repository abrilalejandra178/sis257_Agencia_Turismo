import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guias_turisticos')
export class GuiaTuristico {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellido: string;

  @Column('varchar', { length: 8 })
  teléfono: string;

  @Column('varchar', { length: 1000})
  idioma: string;

  @Column('varchar', { length: 10000 })
  experiencia: string;

  @Column('decimal', { precision: 10, scale: 2 })
  calificación: number;
}
