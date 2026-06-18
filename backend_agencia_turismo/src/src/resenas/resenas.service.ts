import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resena } from './entities/resena.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResenasService {
  constructor(@InjectRepository(Resena) private readonly resenaRepository: Repository<Resena>) {}
  async create(createResenaDto: CreateResenaDto): Promise<Resena> {
    let resena = await this.resenaRepository.findOneBy({
      idUsuario: createResenaDto.idUsuario,
      idPaquete: createResenaDto.idPaquete,
    });

    if (resena) {
      throw new ConflictException('Ya has creado una reseña para este paquete');
    }
    resena = new Resena();
    Object.assign(resena, createResenaDto);
    return this.resenaRepository.save(resena);
  }

  async findAll(): Promise<Resena[]> {
    return this.resenaRepository.find({
      relations: { usuario: true, paquetesTuristicos: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Resena> {
    const resena = await this.resenaRepository.findOne({
      where: { id },
      relations: { usuario: true, paquetesTuristicos: true },
    });
    if (!resena) {
      throw new NotFoundException('Reseña no encontrada');
    }
    return resena;
  }

  async update(id: number, updateResenaDto: UpdateResenaDto) {
    const resena = await this.resenaRepository.findOne({ where: { id } });
    if (!resena) {
      throw new NotFoundException('Reseña no encontrada');
    }
    Object.assign(resena, updateResenaDto);
    return this.resenaRepository.save(resena);
  }

  async remove(id: number) {
    const resena = await this.resenaRepository.findOne({ where: { id } });
    if (!resena) {
      throw new NotFoundException('Reseña no encontrada');
    }
    return this.resenaRepository.remove(resena);
  }
}
