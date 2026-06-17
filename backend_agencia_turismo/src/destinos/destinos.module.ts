import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino_imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destino, DestinoImagen])],
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
