import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportesController } from './transportes.controller';
import { TransportesService } from './transportes.service';
import { Transporte } from './entities/transporte.entity';

describe('TransportesController', () => {
  let controller: TransportesController;

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
      controllers: [TransportesController],
      providers: [
        TransportesService,
        { provide: getRepositoryToken(Transporte), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<TransportesController>(TransportesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
