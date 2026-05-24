import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { InitializedRelationError } from 'typeorm';

export class CreateResenaDto {
  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  readonly comentario: string;

  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  readonly calificacion: number;

  @IsDefined({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  readonly fecha: Date;

  @IsDefined({ message: 'El campo idUsuario es obligatorio' })
  @IsInt({ message: 'El campo idUsuario debe ser un número entero' })
  readonly idUsuario: number;

  @IsDefined({ message: 'El campo idPaquete es obligatorio' })
  @IsInt({ message: 'El campo idPaquete debe ser un número entero' })
  readonly idPaquete: number;
  
}
