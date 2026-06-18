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
} from 'class-validator';
import { EstadoPago } from 'src/enums/estado-pago.enum';
import { MetodoPago } from 'src/enums/metodo-pago.enum';

export class CreatePagoDto {
  @ApiProperty({ example: 500.0 })
  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  readonly monto: number;

  @ApiProperty({ example: '2026-09-01T10:30:00.000Z' })
  @IsDefined({ message: 'La fecha de pago es obligatoria' })
  @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida' })
  readonly fechaPago: Date;

  @ApiProperty({ example: 'efectivo', enum: MetodoPago })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsEnum(MetodoPago, { message: 'El método de pago debe ser válido' })
  readonly metodoPago: MetodoPago;

  @ApiProperty({ example: 'completado', enum: EstadoPago })
  @IsNotEmpty({ message: 'El estado de pago es obligatorio' })
  @IsEnum(EstadoPago, { message: 'El estado de pago debe ser válido' })
  readonly estadoPago: EstadoPago;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El campo idReserva es obligatorio' })
  @IsInt({ message: 'El campo idReserva debe ser un número entero' })
  readonly idReserva: number;

  @ApiProperty({ example: 'REF-123456', required: false })
  @IsOptional()
  @IsString()
  readonly referenciaPago?: string;
}
