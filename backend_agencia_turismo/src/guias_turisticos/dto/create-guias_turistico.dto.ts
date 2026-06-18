import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

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

  // CAMBIO (requisito #4): calificación del guía del 1 al 5 (estrellas).
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  readonly calificación: number;
}