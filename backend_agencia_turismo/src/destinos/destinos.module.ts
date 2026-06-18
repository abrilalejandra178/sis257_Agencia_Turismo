import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './entities/destino.entity';
import { ImagenDestino } from './entities/imagen-destino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destino, ImagenDestino])],
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
