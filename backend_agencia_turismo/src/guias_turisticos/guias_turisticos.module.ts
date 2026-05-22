import { Module } from '@nestjs/common';
import { GuiasTuristicosService } from './guias_turisticos.service';
import { GuiasTuristicosController } from './guias_turisticos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuiaTuristico } from './entities/guias_turistico.entity';

@Module({
   imports: [TypeOrmModule.forFeature([GuiaTuristico])],
  controllers: [GuiasTuristicosController],
  providers: [GuiasTuristicosService],
})
export class GuiasTuristicosModule {}
