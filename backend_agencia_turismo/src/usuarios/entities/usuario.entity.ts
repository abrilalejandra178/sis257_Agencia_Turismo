import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellido: string;

  @Column('varchar', { length: 50, unique: true })
  email: string;

  @Column('varchar', { length: 10 })
  contraseña: string;

  @Column('varchar', { length: 8 })
  telefono: string;

  @Column('date')
  fecha_registro: Date;
}
