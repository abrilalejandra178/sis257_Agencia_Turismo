import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTransporteDto {
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El tipo no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly tipo: string;

  @IsNotEmpty({ message: 'La empresa es obligatoria' })
  @IsString({ message: 'La empresa debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La empresa no puede tener más de 500 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly empresa: string;

  @MaxLength(1000, { message: 'La descripción no puede tener más de 1000 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly descripcion: string;
}
