import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

export class CreatePaquetesTuristicoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripción: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly precio: number;

  @IsNotEmpty({ message: 'La duración es obligatoria' })
  @IsString({ message: 'La duración debe ser una cadena de texto' })
  readonly duración: string;

  @IsNotEmpty({ message: 'La capacidad máxima es obligatoria' })
  @IsInt({ message: 'La capacidad máxima debe ser un número entero' })
  readonly capacidadMaxima: number;

  @IsNotEmpty({ message: 'Incluye hospedaje es obligatorio' })
  @IsString({ message: 'Incluye hospedaje debe ser una cadena de texto' })
  readonly incluyeHospedaje: string;

  @IsNotEmpty({ message: 'Incluye alimentación es obligatorio' })
  @IsString({ message: 'Incluye alimentación debe ser una cadena de texto' })
  readonly incluyeAlimentación: string;

  @IsDefined({ message: 'El idDestino es obligatorio' })
  @IsInt({ message: 'El idDestino debe ser un número entero' })
  readonly idDestino: number;

  @IsDefined({ message: 'El idGuia es obligatorio' })
  @IsInt({ message: 'El idGuia debe ser un número entero' })
  readonly idGuia: number;

  @IsDefined({ message: 'El idTransporte es obligatorio' })
  @IsInt({ message: 'El idTransporte debe ser un número entero' })
  readonly idTransporte: number;
}
