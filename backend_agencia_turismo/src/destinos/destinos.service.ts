import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { Destino } from './entities/destino.entity';
import { ImagenDestino } from './entities/imagen-destino.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DestinosService {
  constructor(@InjectRepository(Destino) private destinosRepository: Repository<Destino>) {}

  // CAMBIO (requisito #1): convierte el arreglo de URLs recibido en el DTO
  // a instancias de ImagenDestino para que TypeORM pueda guardarlas (y
  // eliminar las que ya no estén) junto con el destino.
  private mapearImagenes(urls?: string[]): ImagenDestino[] | undefined {
    if (urls === undefined) return undefined;
    return urls
      .filter(url => !!url && url.trim() !== '')
      .map(url => {
        const imagen = new ImagenDestino();
        imagen.url = url.trim();
        return imagen;
      });
  }

  async create(createDestinoDto: CreateDestinoDto): Promise<Destino> {
    let destino = await this.destinosRepository.findOneBy({
      nombre: createDestinoDto.nombre.trim(),
    });
    if (destino) throw new ConflictException('El destino ya existe');

    destino = new Destino();
    Object.assign(destino, createDestinoDto);
    destino.imagenes = this.mapearImagenes(createDestinoDto.imagenes) ?? [];
    return this.destinosRepository.save(destino);
  }

  async findAll(): Promise<Destino[]> {
    return this.destinosRepository.find({
      relations: { imagenes: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.destinosRepository.findOne({
      where: { id },
      relations: { imagenes: true },
    });
    if (!destino) throw new NotFoundException('El destino no existe');
    return destino;
  }

  async update(id: number, updateDestinoDto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    const { imagenes, ...resto } = updateDestinoDto;
    Object.assign(destino, resto);
    const imagenesMapeadas = this.mapearImagenes(imagenes);
    if (imagenesMapeadas !== undefined) {
      destino.imagenes = imagenesMapeadas;
    }
    return this.destinosRepository.save(destino);
  }

  async remove(id: number): Promise<Destino> {
    const destino = await this.findOne(id);
    return this.destinosRepository.softRemove(destino);
  }
}
