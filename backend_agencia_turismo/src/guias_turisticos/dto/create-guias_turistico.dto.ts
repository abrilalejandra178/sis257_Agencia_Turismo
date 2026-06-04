import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from 'class-validator';

export class CreateGuiasTuristicoDto {
  @ApiProperty({ example: 'Carlos' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ example: 'Mamani' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly apellido: string;

  @ApiProperty({ example: '71234567' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{1,8}$/, {
    message: 'El teléfono debe contener solo dígitos y tener entre 1 y 8 caracteres',
  })
  readonly teléfono: string;

  @ApiProperty({ example: 'Español, Inglés' })
  @IsNotEmpty({ message: 'El idioma es obligatorio' })
  @IsString({ message: 'El idioma debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El idioma no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly idioma: string;

  @ApiProperty({ example: '5 años guiando en el Salar de Uyuni' })
  @IsNotEmpty({ message: 'La experiencia es obligatoria' })
  @IsString({ message: 'La experiencia debe ser una cadena de texto' })
  @MaxLength(1000, { message: 'La experiencia no puede tener más de 1000 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly experiencia: string;

  @ApiProperty({ example: 4.8 })
  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  readonly calificación: number;
}