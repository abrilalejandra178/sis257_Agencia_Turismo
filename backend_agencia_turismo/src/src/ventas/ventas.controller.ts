import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { VentasService } from './ventas.service';
import { CrearVentaDto, ConfirmarPagoDto } from './dto/crear-venta.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

interface RequestWithUser extends Request {
  user?: { id: number };
}

@Controller('ventas')
@UseGuards(AdminGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  async crearVenta(@Body() crearVentaDto: CrearVentaDto, @Req() req: RequestWithUser) {
    const idUsuario = req.user?.id;
    return this.ventasService.crearVenta(crearVentaDto, idUsuario);
  }

  @Get(':id')
  async obtenerReserva(@Param('id') id: string) {
    return this.ventasService.obtenerReserva(Number(id));
  }

  @Post(':id/confirmar-pago')
  async confirmarPago(@Param('id') id: string, @Body() confirmarPagoDto: ConfirmarPagoDto) {
    return this.ventasService.confirmarPago(Number(id), confirmarPagoDto);
  }

  @Get()
  async obtenerVentas(@Query('filtro') filtro?: 'hoy' | 'semana' | 'mes' | 'todos') {
    return this.ventasService.obtenerVentas(filtro);
  }

  @Get('reporte/resumen')
  async obtenerReporteVentas(@Query('filtro') filtro?: 'hoy' | 'semana' | 'mes' | 'todos') {
    return this.ventasService.obtenerReporteVentas(filtro);
  }

  @Patch(':id/cancelar')
  async cancelarReserva(@Param('id') id: string, @Body('motivo') motivo: string) {
    return this.ventasService.cancelarReserva(Number(id), motivo);
  }
}
