import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DestinosService } from './destinos.service';
import { Destino } from './entities/destino.entity';

describe('DestinosService', () => {
  let service: DestinosService;

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
        DestinosService,
        { provide: getRepositoryToken(Destino), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<DestinosService>(DestinosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
