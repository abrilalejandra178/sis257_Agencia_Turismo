import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportesService } from './transportes.service';
import { Transporte } from './entities/transporte.entity';

describe('TransportesService', () => {
  let service: TransportesService;

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
        TransportesService,
        { provide: getRepositoryToken(Transporte), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TransportesService>(TransportesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
