import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Resena } from 'src/resenas/entities/resena.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 20, unique: true })
  usuario: string;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  apellido: string;

  @Column('varchar', { length: 50, unique: true })
  email: string;

  @Column('varchar', { length: 30, name: 'contrasena' })
  contraseña: string;

  @Column('varchar', { length: 20, name: 'pais' })
  país: string;

  @Column('varchar', { length: 8, name: 'telefono' })
  teléfono: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];

  @OneToMany(() => Resena, resena => resena.usuario)  
  resenas: Resena[];
}
