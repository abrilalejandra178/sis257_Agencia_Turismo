import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GuiasTuristicosService } from './guias_turisticos.service';
import { CreateGuiasTuristicoDto } from './dto/create-guias_turistico.dto';
import { UpdateGuiasTuristicoDto } from './dto/update-guias_turistico.dto';

@ApiTags('guias-turisticos')
@ApiBearerAuth('access-token')
@Controller('guias-turisticos')
export class GuiasTuristicosController {
  constructor(private readonly guiasTuristicosService: GuiasTuristicosService) {}

  @Post()
  create(@Body() createGuiasTuristicoDto: CreateGuiasTuristicoDto) {
    return this.guiasTuristicosService.create(createGuiasTuristicoDto);
  }

  @Get()
  findAll() {
    return this.guiasTuristicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guiasTuristicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuiasTuristicoDto: UpdateGuiasTuristicoDto) {
    return this.guiasTuristicosService.update(+id, updateGuiasTuristicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guiasTuristicosService.remove(+id);
  }
}
