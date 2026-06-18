import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { Destino } from './entities/destino.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DestinosService {
  constructor(@InjectRepository(Destino) private destinosRepository: Repository<Destino>) {}

  async create(createDestinoDto: CreateDestinoDto): Promise<Destino> {
    let destino = await this.destinosRepository.findOneBy({
      nombre: createDestinoDto.nombre.trim(),
    });
    if (destino) throw new ConflictException('El destino ya existe');

    destino = new Destino();
    Object.assign(destino, createDestinoDto);
    return this.destinosRepository.save(destino);
  }

  async findAll(): Promise<Destino[]> {
    return this.destinosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.destinosRepository.findOneBy({ id });
    if (!destino) throw new NotFoundException('El destino no existe');
    return destino;
  }

  async update(id: number, updateDestinoDto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    Object.assign(destino, updateDestinoDto);
    return this.destinosRepository.save(destino);
  }

  async remove(id: number): Promise<Destino> {
    const destino = await this.findOne(id);
    return this.destinosRepository.softRemove(destino);
  }
}
