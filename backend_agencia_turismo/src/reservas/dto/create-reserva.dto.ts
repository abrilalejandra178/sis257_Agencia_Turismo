import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty()
  @IsDefined({ message: 'La fecha de reserva es obligatoria' })
  @IsDateString({}, { message: 'La fecha de reserva debe ser una fecha válida' })
  readonly fechaReserva: Date;

  @ApiProperty()
  @IsDefined({ message: 'La cantidad de personas es obligatoria' })
  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  readonly cantidadPersonas: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El total es obligatorio' })
  @IsNumber({}, { message: 'El total debe ser un número' })
  readonly total: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El adelanto es obligatorio' })
  @IsNumber({}, { message: 'El adelanto debe ser un número' })
  readonly adelanto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El saldo pendiente es obligatorio' })
  @IsNumber({}, { message: 'El saldo pendiente debe ser un número' })
  readonly saldoPendiente: number;

  @ApiProperty()
  @IsDefined({ message: 'El estado es obligatorio' })
  readonly estado: string;

  @ApiProperty()
  @IsDefined({ message: 'El idUsuario es obligatorio' })
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  readonly idUsuario: number;

  @ApiProperty()
  @IsDefined({ message: 'El idPaquete es obligatorio' })
  @IsInt({ message: 'El idPaquete debe ser un número entero' })
  readonly idPaquete: number;
}