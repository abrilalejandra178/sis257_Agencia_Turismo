import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { Transporte } from './entities/transporte.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransportesService {
  constructor(
    @InjectRepository(Transporte) private transportesRepository: Repository<Transporte>,
  ) {}

  async create(createTransporteDto: CreateTransporteDto): Promise<Transporte> {
    let transporte = await this.transportesRepository.findOneBy({
      tipo: createTransporteDto.tipo.trim(),
    });
    if (transporte) throw new ConflictException('El transporte ya existe');

    transporte = new Transporte();
    Object.assign(transporte, createTransporteDto);
    return this.transportesRepository.save(transporte);
  }

  async findAll(): Promise<Transporte[]> {
    return this.transportesRepository.find({ order: { tipo: 'ASC' } });
  }

  async findOne(id: number): Promise<Transporte> {
    const transporte = await this.transportesRepository.findOneBy({ id });
    if (!transporte) throw new NotFoundException('El transporte no existe');
    return transporte;
  }

  async update(id: number, updateTransporteDto: UpdateTransporteDto): Promise<Transporte> {
    const transporte = await this.findOne(id);
    Object.assign(transporte, updateTransporteDto);
    return this.transportesRepository.save(transporte);
  }

  async remove(id: number): Promise<Transporte> {
    const transporte = await this.findOne(id);
    return this.transportesRepository.softRemove(transporte);
  }
}
