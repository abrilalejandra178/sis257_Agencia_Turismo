import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  Validate,
} from 'class-validator';
import { EstadoReserva } from 'src/enums/estado-reserva.enum';

class IsFutureDate {
  validate(value: string) {
    if (!value) return true;
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }
  defaultMessage() {
    return 'La fecha de viaje no puede ser anterior a hoy';
  }
}

export class CreateReservaDto {
  @ApiProperty({ example: '2026-10-15T00:00:00.000Z' })
  @IsDefined({ message: 'La fecha de reserva es obligatoria' })
  @IsDateString({}, { message: 'La fecha de reserva debe ser una fecha válida' })
  readonly fechaReserva: Date;

  @ApiProperty({ example: 2 })
  @IsDefined({ message: 'La cantidad de personas es obligatoria' })
  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  readonly cantidadPersonas: number;

  @ApiProperty({ example: 1701.0 })
  @IsNotEmpty({ message: 'El total es obligatorio' })
  @IsNumber({}, { message: 'El total debe ser un número' })
  readonly total: number;

  @ApiProperty({ example: 'confirmada', enum: EstadoReserva })
  @IsDefined({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoReserva, { message: 'El estado debe ser válido' })
  readonly estado: EstadoReserva;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  readonly idUsuario?: number;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idPaquete es obligatorio' })
  @IsInt({ message: 'El idPaquete debe ser un número entero' })
  readonly idPaquete: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'El idCliente debe ser un número entero' })
  readonly idCliente?: number;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  @IsString({ message: 'El nombre del cliente debe ser texto' })
  readonly nombreCliente: string;

  @ApiProperty({ example: '+591 71234567' })
  @IsOptional()
  @IsString({ message: 'El teléfono del cliente debe ser texto' })
  readonly telefonoCliente?: string;

  @ApiProperty({ example: 'cliente@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El email del cliente debe ser válido' })
  readonly emailCliente?: string;

  @ApiProperty({ example: '2026-10-20T00:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de viaje debe ser una fecha válida' })
  @Validate(IsFutureDate)
  readonly fechaViaje?: Date;

  @ApiProperty({ example: [1, 2], required: false })
  @IsOptional()
  @IsArray({ message: 'Los extras deben ser un arreglo' })
  @IsInt({ each: true, message: 'Cada extra debe ser un número entero' })
  readonly idsExtras?: number[];
}
