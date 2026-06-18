import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDestinoDto {
  @ApiProperty({ example: 'Salar de Uyuni' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  readonly nombre: string;

  @ApiProperty({ example: 'El mayor desierto de sal continuo y alto del mundo' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripción: string;

  @ApiProperty({ example: 'Potosí, Bolivia' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  readonly ubicación: string;

  @ApiProperty({ example: ['https://ejemplo.com/salar-de-uyuni.jpg'] })
  @IsNotEmpty({ message: 'Las imágenes son obligatorias' })
  @IsArray({ message: 'Las imágenes deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe agregar al menos una imagen' })
  @IsString({ each: true, message: 'Cada imagen debe ser una URL válida' })
  readonly imagenes: string[];
}
