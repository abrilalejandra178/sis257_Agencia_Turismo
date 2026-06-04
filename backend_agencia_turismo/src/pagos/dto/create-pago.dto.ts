import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({ example: 500.00 })
  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  readonly monto: number;

  @ApiProperty({ example: '2026-09-01T10:30:00.000Z' })
  @IsDefined({ message: 'La fecha de pago es obligatoria' })
  @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida' })
  readonly fechaPago: Date;

  @ApiProperty({ example: 'Transferencia Bancaria' })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  readonly metodoPago: string;

  @ApiProperty({ example: 'Completado' })
  @IsNotEmpty({ message: 'El estado de pago es obligatorio' })
  readonly estadoPago: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El campo idReserva es obligatorio' })
  @IsInt({ message: 'El campo idReserva debe ser un número entero' })
  readonly idReserva: number;
}
