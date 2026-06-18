import { Module } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './entities/destino.entity';
<<<<<<< HEAD
import { ImagenDestino } from './entities/imagen-destino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destino, ImagenDestino])],
=======
import { DestinoImagen } from './entities/destino_imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destino, DestinoImagen])],
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
  controllers: [DestinosController],
  providers: [DestinosService],
})
export class DestinosModule {}
