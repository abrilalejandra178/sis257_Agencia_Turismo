import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Req } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CrearVentaDto, ConfirmarPagoDto, CancelarReservaDto } from './dto/crear-venta.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('ventas')
@UseGuards(AdminGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  async crearVenta(@Body() crearVentaDto: CrearVentaDto, @Req() req: any) {
    const idUsuario = req.user?.id;
    return this.ventasService.crearVenta(crearVentaDto, idUsuario);
  }

  // CAMBIO (requisito #7): búsqueda de cliente frecuente desde el POS.
  @Get('buscar-cliente')
  async buscarClienteFrecuente(@Query('query') query: string) {
    return this.ventasService.buscarClienteFrecuente(query);
  }

  @Get(':id')
  async obtenerReserva(@Param('id') id: string) {
    return this.ventasService.obtenerReserva(Number(id));
  }

  @Post(':id/confirmar-pago')
  async confirmarPago(
    @Param('id') id: string,
    @Body() confirmarPagoDto: ConfirmarPagoDto,
  ) {
    return this.ventasService.confirmarPago(Number(id), confirmarPagoDto);
  }

  @Get()
  async obtenerVentas(@Query('filtro') filtro?: 'hoy' | 'semana' | 'mes' | 'todos') {
    return this.ventasService.obtenerVentas(filtro);
  }

  @Get('reporte/resumen')
  async obtenerReporteVentas(
    @Query('filtro') filtro?: 'hoy' | 'semana' | 'mes' | 'todos',
  ) {
    return this.ventasService.obtenerReporteVentas(filtro);
  }

  // CAMBIO (requisito #2): se acepta el motivo de la cancelación.
  @Patch(':id/cancelar')
  async cancelarReserva(@Param('id') id: string, @Body() cancelarReservaDto?: CancelarReservaDto) {
    return this.ventasService.cancelarReserva(Number(id), cancelarReservaDto?.motivo);
  }
}
