import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';

describe('PagosController', () => {
  let controller: PagosController;

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
      controllers: [PagosController],
      providers: [PagosService, { provide: getRepositoryToken(Pago), useValue: mockRepository }],
    }).compile();

    controller = module.get<PagosController>(PagosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
