import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';
import { EstadoReserva } from '../entities/reserva.entity';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  // CAMBIO (requisito #2): al cancelar una reserva (estado = 'cancelada')
  // se exige indicar el motivo de la cancelación.
  @ApiProperty({
    example: 'El cliente canceló el viaje por motivos de salud',
    required: false,
  })
  @ValidateIf(dto => dto.estado === EstadoReserva.CANCELADA)
  @IsNotEmpty({ message: 'El motivo de cancelación es obligatorio cuando el estado es "cancelada"' })
  @IsString({ message: 'El motivo de cancelación debe ser una cadena de texto' })
  readonly motivoCancelacion?: string;
}
