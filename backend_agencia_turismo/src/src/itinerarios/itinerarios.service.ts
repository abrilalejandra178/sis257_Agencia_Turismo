import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerario } from './entities/itinerario.entity';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';

@Injectable()
export class ItinerariosService {
  constructor(
    @InjectRepository(Itinerario)
    private readonly itinerarioRepository: Repository<Itinerario>,
  ) {}

  async create(createItinerarioDto: CreateItinerarioDto): Promise<Itinerario> {
    const itinerario = this.itinerarioRepository.create(createItinerarioDto);
    return this.itinerarioRepository.save(itinerario);
  }

  async findAll(): Promise<Itinerario[]> {
    return this.itinerarioRepository.find({ relations: { paquete: true }, order: { id: 'ASC' } });
  }

  async findByPaquete(idPaquete: number): Promise<Itinerario[]> {
    return this.itinerarioRepository.find({
      where: { idPaquete },
      relations: { paquete: true },
      order: { dia: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Itinerario> {
    const itinerario = await this.itinerarioRepository.findOne({
      where: { id },
      relations: { paquete: true },
    });
    if (!itinerario) throw new NotFoundException('El itinerario no existe');
    return itinerario;
  }

  async update(id: number, updateItinerarioDto: UpdateItinerarioDto): Promise<Itinerario> {
    const itinerario = await this.findOne(id);
    Object.assign(itinerario, updateItinerarioDto);
    return this.itinerarioRepository.save(itinerario);
  }

  async remove(id: number): Promise<void> {
    const itinerario = await this.findOne(id);
    await this.itinerarioRepository.softRemove(itinerario);
  }
}
