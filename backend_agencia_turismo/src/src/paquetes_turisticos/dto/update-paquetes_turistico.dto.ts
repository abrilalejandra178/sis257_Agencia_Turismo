import { PartialType } from '@nestjs/mapped-types';
import { CreatePaquetesTuristicoDto } from './create-paquetes_turistico.dto';

export class UpdatePaquetesTuristicoDto extends PartialType(CreatePaquetesTuristicoDto) {}
