import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDestinoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripción: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  readonly ubicación: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  @MaxLength(1000, { message: 'La imagen no puede tener más de 1000 caracteres' })
  readonly imagen: string;
}