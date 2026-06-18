import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResenasService } from './resenas.service';
import { Resena } from './entities/resena.entity';

describe('ResenasService', () => {
  let service: ResenasService;

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
        ResenasService,
        { provide: getRepositoryToken(Resena), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ResenasService>(ResenasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
