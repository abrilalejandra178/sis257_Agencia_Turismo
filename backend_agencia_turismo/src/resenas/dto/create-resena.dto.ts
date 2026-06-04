import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateResenaDto {
  @ApiProperty({ example: '¡Excelente experiencia! El guía fue muy amable y los paisajes increíbles.' })
  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  readonly comentario: string;

  @ApiProperty({ example: 5 })
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  readonly calificacion: number;

  @ApiProperty({ example: '2026-10-18T15:00:00.000Z' })
  @IsDefined({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  readonly fecha: Date;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El campo idUsuario es obligatorio' })
  @IsInt({ message: 'El campo idUsuario debe ser un número entero' })
  readonly idUsuario: number;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El campo idPaquete es obligatorio' })
  @IsInt({ message: 'El campo idPaquete debe ser un número entero' })
  readonly idPaquete: number;
}