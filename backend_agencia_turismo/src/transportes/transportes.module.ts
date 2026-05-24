import { Module } from '@nestjs/common';
import { TransportesService } from './transportes.service';
import { TransportesController } from './transportes.controller';
import { Transporte } from './entities/transporte.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transporte])],
  controllers: [TransportesController],
  providers: [TransportesService],
})
export class TransportesModule {}
