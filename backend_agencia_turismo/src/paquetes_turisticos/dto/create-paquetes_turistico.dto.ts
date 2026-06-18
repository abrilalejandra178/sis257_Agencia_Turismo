import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreatePaquetesTuristicoDto {
  @ApiProperty({ example: 'Tour Salar de Uyuni 3 Días' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ example: 'Descubre la magia del Salar de Uyuni y las lagunas de colores' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripción: string;

  @ApiProperty({ example: 850.50 })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly precio: number;

  @ApiProperty({ example: '3 días y 2 noches' })
  @IsNotEmpty({ message: 'La duración es obligatoria' })
  @IsString({ message: 'La duración debe ser una cadena de texto' })
  readonly duración: string;

  @ApiProperty({ example: 15 })
  @IsNotEmpty({ message: 'La capacidad máxima es obligatoria' })
  @IsInt({ message: 'La capacidad máxima debe ser un número entero' })
  readonly capacidadMaxima: number;

  // CAMBIO (requisito #3): ahora es un select con solo dos opciones,
  // antes era un campo de texto libre.
  @ApiProperty({ example: 'Sí', enum: ['Sí', 'No'] })
  @IsNotEmpty({ message: 'Incluye hospedaje es obligatorio' })
  @IsIn(['Sí', 'No'], { message: 'Incluye hospedaje debe ser "Sí" o "No"' })
  readonly incluyeHospedaje: string;

  // CAMBIO (requisito #3): ahora es un select con solo dos opciones,
  // antes era un campo de texto libre.
  @ApiProperty({ example: 'Sí', enum: ['Sí', 'No'] })
  @IsNotEmpty({ message: 'Incluye alimentación es obligatorio' })
  @IsIn(['Sí', 'No'], { message: 'Incluye alimentación debe ser "Sí" o "No"' })
  readonly incluyeAlimentación: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idDestino es obligatorio' })
  @IsInt({ message: 'El idDestino debe ser un número entero' })
  readonly idDestino: number;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idGuia es obligatorio' })
  @IsInt({ message: 'El idGuia debe ser un número entero' })
  readonly idGuia: number;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idTransporte es obligatorio' })
  @IsInt({ message: 'El idTransporte debe ser un número entero' })
  readonly idTransporte: number;
}