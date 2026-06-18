import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Reserva])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
