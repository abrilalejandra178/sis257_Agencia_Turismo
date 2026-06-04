import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre de usuario para el login', example: 'jperez' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @MinLength(4, { message: 'El usuario debe tener mínimo 4 caracteres' })
  @MaxLength(20, { message: 'El usuario no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly usuario: string;

  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly apellido: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida' })
  readonly email: string;

  @ApiProperty({ example: 'secreta123' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MaxLength(360, { message: 'La contraseña no puede tener más de 360 caracteres' })
  readonly contraseña: string;

  @ApiProperty({ example: 'Bolivia' })
  @MaxLength(20, { message: 'El país no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly país: string;

  @ApiProperty({ example: '76543210' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{1,8}$/, {
    message: 'El teléfono debe contener solo dígitos y tener entre 1 y 8 caracteres',
  })
  readonly teléfono: string;
}