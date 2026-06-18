import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuiasTuristicosController } from './guias_turisticos.controller';
import { GuiasTuristicosService } from './guias_turisticos.service';
import { GuiaTuristico } from './entities/guias_turistico.entity';

describe('GuiasTuristicosController', () => {
  let controller: GuiasTuristicosController;

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
      controllers: [GuiasTuristicosController],
      providers: [
        GuiasTuristicosService,
        { provide: getRepositoryToken(GuiaTuristico), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GuiasTuristicosController>(GuiasTuristicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
