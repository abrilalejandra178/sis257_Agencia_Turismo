import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';
import { PaquetesTuristico } from './entities/paquetes_turistico.entity';
import { Extra } from 'src/extras/entities/extra.entity';

describe('PaquetesTuristicosService', () => {
  let service: PaquetesTuristicosService;

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
        PaquetesTuristicosService,
        { provide: getRepositoryToken(PaquetesTuristico), useValue: mockRepository },
        { provide: getRepositoryToken(Extra), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PaquetesTuristicosService>(PaquetesTuristicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
