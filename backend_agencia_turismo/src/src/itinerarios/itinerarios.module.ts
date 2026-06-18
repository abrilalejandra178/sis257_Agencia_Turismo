import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerario } from './entities/itinerario.entity';
import { ItinerariosService } from './itinerarios.service';
import { ItinerariosController } from './itinerarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerario])],
  controllers: [ItinerariosController],
  providers: [ItinerariosService],
})
export class ItinerariosModule {}
