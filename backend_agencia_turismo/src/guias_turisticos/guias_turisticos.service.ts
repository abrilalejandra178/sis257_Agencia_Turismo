import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuiasTuristicoDto } from './dto/create-guias_turistico.dto';
import { UpdateGuiasTuristicoDto } from './dto/update-guias_turistico.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GuiaTuristico } from './entities/guias_turistico.entity';

@Injectable()
export class GuiasTuristicosService {
  constructor(
    @InjectRepository(GuiaTuristico) private guiasRepository: Repository<GuiaTuristico>,
  ) {}

  async create(createGuiasTuristicoDto: CreateGuiasTuristicoDto): Promise<GuiaTuristico> {
    let guia = await this.guiasRepository.findOneBy({
      nombre: createGuiasTuristicoDto.nombre.trim(),
    });
    if (guia) throw new ConflictException('El guía ya existe');

    guia = new GuiaTuristico();
    Object.assign(guia, createGuiasTuristicoDto);
    return this.guiasRepository.save(guia);
  }

  async findAll(): Promise<GuiaTuristico[]> {
    return this.guiasRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<GuiaTuristico> {
    const guia = await this.guiasRepository.findOneBy({ id });
    if (!guia) throw new NotFoundException('El guía no existe');
    return guia;
  }

  async update(
    id: number,
    updateGuiasTuristicoDto: UpdateGuiasTuristicoDto,
  ): Promise<GuiaTuristico> {
    const guia = await this.findOne(id);
    Object.assign(guia, updateGuiasTuristicoDto);
    return this.guiasRepository.save(guia);
  }

  async remove(id: number): Promise<GuiaTuristico> {
    const guia = await this.findOne(id);
    return this.guiasRepository.softRemove(guia);
  }
}
