import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({ example: '2026-10-15T00:00:00.000Z' })
  @IsDefined({ message: 'La fecha de reserva es obligatoria' })
  @IsDateString({}, { message: 'La fecha de reserva debe ser una fecha válida' })
  readonly fechaReserva: Date;

  @ApiProperty({ example: 2 })
  @IsDefined({ message: 'La cantidad de personas es obligatoria' })
  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  readonly cantidadPersonas: number;

  @ApiProperty({ example: 1701.00 })
  @IsNotEmpty({ message: 'El total es obligatorio' })
  @IsNumber({}, { message: 'El total debe ser un número' })
  readonly total: number;

  @ApiProperty({ example: 500.00 })
  @IsNotEmpty({ message: 'El adelanto es obligatorio' })
  @IsNumber({}, { message: 'El adelanto debe ser un número' })
  readonly adelanto: number;

  @ApiProperty({ example: 1201.00 })
  @IsNotEmpty({ message: 'El saldo pendiente es obligatorio' })
  @IsNumber({}, { message: 'El saldo pendiente debe ser un número' })
  readonly saldoPendiente: number;

  @ApiProperty({ example: 'Confirmada' })
  @IsDefined({ message: 'El estado es obligatorio' })
  readonly estado: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idUsuario es obligatorio' })
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  readonly idUsuario: number;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El idPaquete es obligatorio' })
  @IsInt({ message: 'El idPaquete debe ser un número entero' })
  readonly idPaquete: number;
}