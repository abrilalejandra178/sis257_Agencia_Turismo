import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,
  ) {}

  async create(createExtraDto: CreateExtraDto): Promise<Extra> {
    let extra = await this.extraRepository.findOneBy({ nombre: createExtraDto.nombre });
    if (extra) throw new ConflictException('Ya existe un extra con ese nombre');

    extra = this.extraRepository.create(createExtraDto);
    return this.extraRepository.save(extra);
  }

  async findAll(): Promise<Extra[]> {
    return this.extraRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Extra> {
    const extra = await this.extraRepository.findOneBy({ id });
    if (!extra) throw new NotFoundException('El extra no existe');
    return extra;
  }

  async update(id: number, updateExtraDto: UpdateExtraDto): Promise<Extra> {
    const extra = await this.findOne(id);
    Object.assign(extra, updateExtraDto);
    return this.extraRepository.save(extra);
  }

  async remove(id: number): Promise<void> {
    const extra = await this.findOne(id);
    await this.extraRepository.softRemove(extra);
  }
}
