import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Extra } from 'src/extras/entities/extra.entity';

describe('ReservasController', () => {
  let controller: ReservasController;

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
      controllers: [ReservasController],
      providers: [
        ReservasService,
        { provide: getRepositoryToken(Reserva), useValue: mockRepository },
        { provide: getRepositoryToken(PaquetesTuristico), useValue: mockRepository },
        { provide: getRepositoryToken(Extra), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<ReservasController>(ReservasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
