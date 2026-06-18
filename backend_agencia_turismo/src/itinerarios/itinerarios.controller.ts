import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ItinerariosService } from './itinerarios.service';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';

@ApiTags('itinerarios')
@ApiBearerAuth('access-token')
@Controller('itinerarios')
export class ItinerariosController {
  constructor(private readonly itinerariosService: ItinerariosService) {}

  @Post()
  create(@Body() createItinerarioDto: CreateItinerarioDto) {
    return this.itinerariosService.create(createItinerarioDto);
  }

  @Get()
  findAll(@Query('idPaquete') idPaquete?: string) {
    if (idPaquete) {
      return this.itinerariosService.findByPaquete(Number(idPaquete));
    }
    return this.itinerariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itinerariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItinerarioDto: UpdateItinerarioDto) {
    return this.itinerariosService.update(+id, updateItinerarioDto);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.itinerariosService.remove(+id);
  }
}
