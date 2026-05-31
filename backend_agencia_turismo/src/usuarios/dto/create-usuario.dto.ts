import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly apellido: string;

  @ApiProperty()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MaxLength(10, { message: 'La contraseña no puede tener más de 10 caracteres' })
  readonly contraseña: string;

  @ApiProperty()
  @MaxLength(20, { message: 'El país no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly país: string;

  @ApiProperty()
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{1,8}$/, {
    message: 'El teléfono debe contener solo dígitos y tener entre 1 y 8 caracteres',
  })
  readonly teléfono: string;
}