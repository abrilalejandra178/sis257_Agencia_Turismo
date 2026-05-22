import { Test, TestingModule } from '@nestjs/testing';
import { GuiasTuristicosController } from './guias_turisticos.controller';
import { GuiasTuristicosService } from './guias_turisticos.service';

describe('GuiasTuristicosController', () => {
  let controller: GuiasTuristicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuiasTuristicosController],
      providers: [GuiasTuristicosService],
    }).compile();

    controller = module.get<GuiasTuristicosController>(GuiasTuristicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
