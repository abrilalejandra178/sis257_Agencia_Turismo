import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';
import { CreatePaquetesTuristicoDto } from './dto/create-paquetes_turistico.dto';
import { UpdatePaquetesTuristicoDto } from './dto/update-paquetes_turistico.dto';

@Controller('paquetes-turisticos')
export class PaquetesTuristicosController {
  constructor(private readonly paquetesTuristicosService: PaquetesTuristicosService) {}

  @Post()
  create(@Body() createPaquetesTuristicoDto: CreatePaquetesTuristicoDto) {
    return this.paquetesTuristicosService.create(createPaquetesTuristicoDto);
  }

  @Get()
  findAll() {
    return this.paquetesTuristicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paquetesTuristicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaquetesTuristicoDto: UpdatePaquetesTuristicoDto) {
    return this.paquetesTuristicosService.update(+id, updatePaquetesTuristicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paquetesTuristicosService.remove(+id);
  }
}
