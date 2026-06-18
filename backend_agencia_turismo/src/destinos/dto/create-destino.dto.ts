import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({ example: 'https://ejemplo.com/salar-de-uyuni.jpg' })
  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  @MaxLength(1000, { message: 'La imagen no puede tener más de 1000 caracteres' })
  readonly imagen: string;

  // CAMBIO (requisito #1): permite enviar varias URLs de imágenes
  // adicionales (galería) además de la imagen principal.
  @ApiProperty({
    example: ['https://ejemplo.com/foto1.jpg', 'https://ejemplo.com/foto2.jpg'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Las imágenes deben enviarse como un arreglo' })
  @IsString({ each: true, message: 'Cada imagen debe ser una cadena de texto (URL)' })
  readonly imagenes?: string[];
}