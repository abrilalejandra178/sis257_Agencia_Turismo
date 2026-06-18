import { Module } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena } from './entities/resena.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Resena])],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
