import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuiasTuristicosService } from './guias_turisticos.service';
import { GuiaTuristico } from './entities/guias_turistico.entity';

describe('GuiasTuristicosService', () => {
  let service: GuiasTuristicosService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuiasTuristicosService,
        { provide: getRepositoryToken(GuiaTuristico), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<GuiasTuristicosService>(GuiasTuristicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
