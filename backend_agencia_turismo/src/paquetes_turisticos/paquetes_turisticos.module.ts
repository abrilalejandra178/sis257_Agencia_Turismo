import { Module } from '@nestjs/common';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';
import { PaquetesTuristicosController } from './paquetes_turisticos.controller';
import { PaquetesTuristico } from './entities/paquetes_turistico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaquetesTuristico])],
  controllers: [PaquetesTuristicosController],
  providers: [PaquetesTuristicosService],
})
export class PaquetesTuristicosModule {}
