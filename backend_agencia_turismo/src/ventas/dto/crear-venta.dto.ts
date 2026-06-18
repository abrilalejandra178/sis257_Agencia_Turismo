import { IsString, IsEmail, IsPhoneNumber, IsInt, IsPositive, IsOptional, IsArray, IsEnum, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';
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

  // CAMBIO (requisito #5): monto que entrega el cliente (por ejemplo en
  // efectivo). Si es mayor al total de la reserva, se calcula el cambio.
  @IsOptional()
  @IsNumber()
  @IsPositive()
  montoRecibido?: number;
}

// CAMBIO (requisito #2): DTO para registrar el motivo cuando se cancela
// o se da de baja una reserva desde el módulo de ventas (POS).
export class CancelarReservaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El motivo de cancelación no puede estar vacío' })
  motivo?: string;
}
