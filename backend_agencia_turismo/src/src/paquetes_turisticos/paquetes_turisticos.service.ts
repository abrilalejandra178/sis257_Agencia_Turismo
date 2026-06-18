import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaquetesTuristicoDto } from './dto/create-paquetes_turistico.dto';
import { UpdatePaquetesTuristicoDto } from './dto/update-paquetes_turistico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Extra } from 'src/extras/entities/extra.entity';
import { PaquetesTuristico } from './entities/paquetes_turistico.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PaquetesTuristicosService {
  constructor(
    @InjectRepository(PaquetesTuristico)
    private readonly paquetesTuristicoRepository: Repository<PaquetesTuristico>,
    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,
  ) {}

  async create(createPaquetesTuristicoDto: CreatePaquetesTuristicoDto) {
    let paquetesTuristico = await this.paquetesTuristicoRepository.findOne({
      where: {
        idDestino: createPaquetesTuristicoDto.idDestino,
        idGuia: createPaquetesTuristicoDto.idGuia,
        idTransporte: createPaquetesTuristicoDto.idTransporte,
      },
    });

    if (paquetesTuristico) throw new ConflictException('El paquete turístico ya existe');

    paquetesTuristico = new PaquetesTuristico();
    Object.assign(paquetesTuristico, createPaquetesTuristicoDto);

    if (createPaquetesTuristicoDto.idsExtras?.length) {
      paquetesTuristico.extras = await this.extraRepository.findBy({
        id: In(createPaquetesTuristicoDto.idsExtras),
      });
    }

    return this.paquetesTuristicoRepository.save(paquetesTuristico);
  }

  async findAll(): Promise<PaquetesTuristico[]> {
    return this.paquetesTuristicoRepository.find({
      relations: { destino: true, guia: true, transporte: true, extras: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PaquetesTuristico> {
    const paquetesTuristico = await this.paquetesTuristicoRepository.findOne({
      where: { id },
      relations: { destino: true, guia: true, transporte: true, extras: true },
    });
    if (!paquetesTuristico) throw new NotFoundException('Paquete turístico no encontrado');
    return paquetesTuristico;
  }

  async update(id: number, updatePaquetesTuristicoDto: UpdatePaquetesTuristicoDto) {
    const paquetesTuristico = await this.paquetesTuristicoRepository.findOne({
      where: { id },
      relations: { extras: true },
    });
    if (!paquetesTuristico) {
      throw new Error('Paquete turístico no encontrado');
    }
    Object.assign(paquetesTuristico, updatePaquetesTuristicoDto);

    if (updatePaquetesTuristicoDto.idsExtras !== undefined) {
      paquetesTuristico.extras = updatePaquetesTuristicoDto.idsExtras.length
        ? await this.extraRepository.findBy({ id: In(updatePaquetesTuristicoDto.idsExtras) })
        : [];
    }

    return this.paquetesTuristicoRepository.save(paquetesTuristico);
  }

  async remove(id: number) {
    const paquetesTuristico = await this.paquetesTuristicoRepository.findOne({ where: { id } });
    if (!paquetesTuristico) {
      throw new Error('Paquete turístico no encontrado');
    }
    return this.paquetesTuristicoRepository.remove(paquetesTuristico);
  }
}
