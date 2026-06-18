import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(50)
  readonly nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser texto' })
  @MaxLength(50)
  readonly apellido: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(100)
  readonly email: string;

  @ApiProperty({ example: '71234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly telefono?: string;

  @ApiProperty({ example: '1234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly documento?: string;
}
