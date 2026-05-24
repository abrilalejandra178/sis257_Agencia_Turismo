import {
  IsDateString,
  IsDecimal,
  IsDefined,
  IsIBAN,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateReservaDto {
  @IsDefined({ message: 'La fecha de reserva es obligatoria' })
  @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida' })
  readonly fechaReserva: Date;

  @IsDefined({ message: 'La cantidad de personas es obligatoria' })
  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  readonly cantidadPersonas: number;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly total: number;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly adelanto: number;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  readonly saldoPendiente: number;

  @IsDefined({ message: 'El estado es obligatorio' })
  readonly estado: string;

  @IsDefined({ message: 'El idUsuario es obligatorio' })
  @IsInt({ message: 'El idUsuario debe ser un número entero' })
  readonly idUsuario: number;

  @IsDefined({ message: 'El idPaquete es obligatorio' })
  @IsInt({ message: 'El idPaquete debe ser un número entero' })
  readonly idPaquete: number;
}
