import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Pago, PaquetesTuristico])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
