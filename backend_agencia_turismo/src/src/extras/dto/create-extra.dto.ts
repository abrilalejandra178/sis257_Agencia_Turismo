import { ApiProperty } from '@nestjs/swagger';
import { TipoExtra } from 'src/enums/tipo-extra.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExtraDto {
  @ApiProperty({ example: 'Seguro de viaje' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly nombre: string;

  @ApiProperty({ example: 'Cobertura completa durante el tour' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly descripcion?: string;

  @ApiProperty({ example: 50.0 })
  @IsNotEmpty()
  @IsNumber()
  readonly precio: number;

  @ApiProperty({ example: TipoExtra.SERVICIO, enum: TipoExtra })
  @IsNotEmpty()
  @IsEnum(TipoExtra)
  readonly tipo: TipoExtra;
}
