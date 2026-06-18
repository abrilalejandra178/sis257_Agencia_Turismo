import { Module } from '@nestjs/common';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';
import { PaquetesTuristicosController } from './paquetes_turisticos.controller';
import { PaquetesTuristico } from './entities/paquetes_turistico.entity';
import { Extra } from 'src/extras/entities/extra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaquetesTuristico, Extra])],
  controllers: [PaquetesTuristicosController],
  providers: [PaquetesTuristicosService],
})
export class PaquetesTuristicosModule {}
