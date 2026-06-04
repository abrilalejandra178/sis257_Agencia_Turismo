import { Test, TestingModule } from '@nestjs/testing';
import { PaquetesTuristicosController } from './paquetes_turisticos.controller';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';

describe('PaquetesTuristicosController', () => {
  let controller: PaquetesTuristicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaquetesTuristicosController],
      providers: [PaquetesTuristicosService],
    }).compile();

    controller = module.get<PaquetesTuristicosController>(PaquetesTuristicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
