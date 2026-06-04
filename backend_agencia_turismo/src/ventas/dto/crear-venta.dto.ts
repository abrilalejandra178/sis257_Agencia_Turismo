import { IsString, IsEmail, IsPhoneNumber, IsInt, IsPositive, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';
import { MetodoPago } from 'src/pagos/entities/pago.entity';

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

  @IsArray()
  items: ItemVentaDto[];

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsDateString()
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
