import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  Validate,
} from 'class-validator';
import { MetodoPago } from 'src/enums/metodo-pago.enum';

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

export class ItemVentaDto {
  @IsInt()
  idPaquete: number;

  @IsInt()
  @IsPositive()
  cantidadPersonas: number;
}

export class CrearVentaDto {
  @IsString()
  nombreCliente: string;

  @IsOptional()
  @IsPhoneNumber('BO')
  telefonoCliente?: string;

  @IsOptional()
  @IsEmail()
  emailCliente?: string;

  @IsOptional()
  @IsInt()
  idCliente?: number;

  @IsArray()
  items: ItemVentaDto[];

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsDateString()
  @Validate(IsFutureDate)
  fechaViaje?: string;

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsPositive()
  monto?: number;
}

export class ConfirmarPagoDto {
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsOptional()
  @IsString()
  referenciaPago?: string;
}
