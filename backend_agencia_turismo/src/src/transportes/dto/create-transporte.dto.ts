import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { EmpresaTransporte } from 'src/enums/empresa-transporte.enum';
import { TipoTransporte } from 'src/enums/tipo-transporte.enum';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTransporteDto {
  @ApiProperty({ example: TipoTransporte.BUS, enum: TipoTransporte })
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @IsEnum(TipoTransporte, { message: 'El tipo de transporte no es válido' })
  readonly tipo: TipoTransporte;

  @ApiProperty({ example: EmpresaTransporte.TRANS_COPACABANA, enum: EmpresaTransporte })
  @IsNotEmpty({ message: 'La empresa es obligatoria' })
  @IsEnum(EmpresaTransporte, { message: 'La empresa no es válida' })
  readonly empresa: EmpresaTransporte;

  @ApiProperty({ example: 'Bus con asientos reclinables 160 grados, calefacción y baño' })
  @MaxLength(1000, { message: 'La descripción no puede tener más de 1000 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value === 'string' ? value.trim() : value))
  readonly descripcion: string;
}
