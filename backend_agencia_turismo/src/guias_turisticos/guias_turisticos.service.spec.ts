import { Test, TestingModule } from '@nestjs/testing';
import { GuiasTuristicosService } from './guias_turisticos.service';

describe('GuiasTuristicosService', () => {
  let service: GuiasTuristicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuiasTuristicosService],
    }).compile();

    service = module.get<GuiasTuristicosService>(GuiasTuristicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
