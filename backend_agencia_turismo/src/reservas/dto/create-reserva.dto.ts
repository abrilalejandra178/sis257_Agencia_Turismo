import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { EstadoReserva } from '../entities/reserva.entity';

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

  @ApiProperty({ example: 500.0 })
  @IsNotEmpty({ message: 'El adelanto es obligatorio' })
  @IsNumber({}, { message: 'El adelanto debe ser un número' })
  readonly adelanto: number;

  @ApiProperty({ example: 1201.0 })
  @IsNotEmpty({ message: 'El saldo pendiente es obligatorio' })
  @IsNumber({}, { message: 'El saldo pendiente debe ser un número' })
  readonly saldoPendiente: number;

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

  @ApiProperty({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString({ message: 'El nombre del cliente debe ser texto' })
  readonly nombreCliente?: string;

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
  readonly fechaViaje?: Date;
}
