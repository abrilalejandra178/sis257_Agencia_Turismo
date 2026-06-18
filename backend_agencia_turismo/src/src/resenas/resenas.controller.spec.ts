import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';
import { Resena } from './entities/resena.entity';

describe('ResenasController', () => {
  let controller: ResenasController;

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
      controllers: [ResenasController],
      providers: [
        ResenasService,
        { provide: getRepositoryToken(Resena), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<ResenasController>(ResenasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
