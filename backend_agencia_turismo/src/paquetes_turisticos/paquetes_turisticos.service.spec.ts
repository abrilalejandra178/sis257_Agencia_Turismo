import { Test, TestingModule } from '@nestjs/testing';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';

describe('PaquetesTuristicosService', () => {
  let service: PaquetesTuristicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaquetesTuristicosService],
    }).compile();

    service = module.get<PaquetesTuristicosService>(PaquetesTuristicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
