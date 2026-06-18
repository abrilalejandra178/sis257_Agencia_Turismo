import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@ApiTags('reservas')
@ApiBearerAuth('access-token')
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  // CAMBIO (requisito #7): se declara ANTES de ':id' para que NestJS no
  // confunda 'buscar-cliente' con un id de reserva.
  @Get('buscar-cliente')
  buscarPorCliente(@Query('query') query: string) {
    return this.reservasService.buscarPorCliente(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }

  // CAMBIO (requisito #2): se acepta un 'motivo' opcional en el cuerpo de
  // la petición DELETE para registrar por qué se dio de baja la reserva.
  @Delete(':id')
  remove(@Param('id') id: string, @Body() body?: { motivo?: string }) {
    return this.reservasService.remove(+id, body?.motivo);
  }
}
