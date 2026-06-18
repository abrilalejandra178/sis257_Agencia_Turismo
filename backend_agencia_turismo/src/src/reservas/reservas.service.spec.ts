import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { Extra } from 'src/extras/entities/extra.entity';

describe('ReservasService', () => {
  let service: ReservasService;

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
        ReservasService,
        { provide: getRepositoryToken(Reserva), useValue: mockRepository },
        { provide: getRepositoryToken(PaquetesTuristico), useValue: mockRepository },
        { provide: getRepositoryToken(Extra), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
