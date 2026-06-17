import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({
    type: [Object],
    example: [
    {
      urlImagen: 'https://ejemplo.com/salar-de-uyuni.jpg',
    },
    ],
  })
  readonly imagenes: { urlImagen: string }[];
}