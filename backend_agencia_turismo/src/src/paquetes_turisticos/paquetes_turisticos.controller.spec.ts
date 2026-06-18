import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaquetesTuristicosController } from './paquetes_turisticos.controller';
import { PaquetesTuristicosService } from './paquetes_turisticos.service';
import { PaquetesTuristico } from './entities/paquetes_turistico.entity';
import { Extra } from 'src/extras/entities/extra.entity';

describe('PaquetesTuristicosController', () => {
  let controller: PaquetesTuristicosController;

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
      controllers: [PaquetesTuristicosController],
      providers: [
        PaquetesTuristicosService,
        { provide: getRepositoryToken(PaquetesTuristico), useValue: mockRepository },
        { provide: getRepositoryToken(Extra), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<PaquetesTuristicosController>(PaquetesTuristicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
