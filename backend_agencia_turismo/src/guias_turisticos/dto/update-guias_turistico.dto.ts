import { PartialType } from '@nestjs/mapped-types';
import { CreateGuiasTuristicoDto } from './create-guias_turistico.dto';

export class UpdateGuiasTuristicoDto extends PartialType(CreateGuiasTuristicoDto) {}
