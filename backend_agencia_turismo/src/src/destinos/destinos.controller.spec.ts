import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DestinosController } from './destinos.controller';
import { DestinosService } from './destinos.service';
import { Destino } from './entities/destino.entity';

describe('DestinosController', () => {
  let controller: DestinosController;

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
      controllers: [DestinosController],
      providers: [
        DestinosService,
        { provide: getRepositoryToken(Destino), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<DestinosController>(DestinosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
