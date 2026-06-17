import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino_imagen.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private destinosRepository: Repository<Destino>,

    @InjectRepository(DestinoImagen)
    private destinoImagenRepository: Repository<DestinoImagen>,
  ) {}

  // =========================
  // CREATE
  // =========================
  async create(data: any) {
    const destino = this.destinosRepository.create({
      nombre: data.nombre,
      descripción: data.descripción,
      ubicación: data.ubicación,
    });

    const savedDestino = await this.destinosRepository.save(destino);

    // Guardar imágenes
    if (data.imagenes?.length) {
      const imagenes = data.imagenes.map((img) =>
        this.destinoImagenRepository.create({
          urlImagen: img.urlImagen,
          destino: savedDestino,
        }),
      );

      await this.destinoImagenRepository.save(imagenes);
    }

    return this.destinosRepository.findOne({
      where: { id: savedDestino.id },
      relations: { imagenes: true },
    });
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(): Promise<Destino[]> {
    return this.destinosRepository.find({
      relations: { imagenes: true },
      order: {
        nombre: 'ASC',
      },
    });
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number): Promise<Destino> {
    const destino = await this.destinosRepository.findOne({
      where: { id },
      relations: { imagenes: true },
    });

    if (!destino) {
      throw new NotFoundException('El destino no existe');
    }

    return destino;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, updateData: any): Promise<Destino> {
    const destino = await this.findOne(id);

    // actualizar campos básicos
    Object.assign(destino, {
      nombre: updateData.nombre,
      descripción: updateData.descripción,
      ubicación: updateData.ubicación,
    });

    await this.destinosRepository.save(destino);

    // 🔥 si vienen imágenes nuevas, reemplazarlas
    if (updateData.imagenes) {
      await this.destinoImagenRepository.delete({
        destino: { id },
      });

      const nuevasImagenes = updateData.imagenes.map((img) =>
        this.destinoImagenRepository.create({
          urlImagen: img.urlImagen,
          destino,
        }),
      );

      await this.destinoImagenRepository.save(nuevasImagenes);
    }

    return this.findOne(id);
  }

  // =========================
  // DELETE (soft delete)
  // =========================
  async remove(id: number): Promise<Destino> {
    const destino = await this.findOne(id);
    return this.destinosRepository.softRemove(destino);
  }
}