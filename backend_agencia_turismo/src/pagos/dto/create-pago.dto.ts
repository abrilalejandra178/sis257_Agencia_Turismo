import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  readonly monto: number;

  @ApiProperty()
  @IsDefined({ message: 'La fecha de pago es obligatoria' })
  @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida' })
  readonly fechaPago: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  readonly metodoPago: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El estado de pago es obligatorio' })
  readonly estadoPago: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo idReserva es obligatorio' })
  @IsInt({ message: 'El campo idReserva debe ser un número entero' })
  readonly idReserva: number;
}
