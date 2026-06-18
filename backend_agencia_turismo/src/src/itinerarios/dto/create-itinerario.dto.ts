import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItinerarioDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly dia: number;

  @ApiProperty({ example: 'Llegada y check-in' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly titulo: string;

  @ApiProperty({ example: 'Recepción en el aeropuerto y traslado al hotel' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  readonly descripcion: string;

  @ApiProperty({ example: '08:00' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly horaInicio?: string;

  @ApiProperty({ example: '12:00' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly horaFin?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly idPaquete: number;
}
