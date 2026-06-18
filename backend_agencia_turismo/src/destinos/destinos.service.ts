import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Destino } from './entities/destino.entity';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4b183ba (modificacion de imagenes,paquetes y pagos)
import { ImagenDestino } from './entities/imagen-destino.entity';
import { In, Repository } from 'typeorm';
=======
import { DestinoImagen } from './entities/destino_imagen.entity';
import { Repository } from 'typeorm';
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private destinosRepository: Repository<Destino>,

<<<<<<< HEAD
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
=======
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
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
    });

<<<<<<< HEAD
    destino = new Destino();
    Object.assign(destino, createDestinoDto);
    destino.imagenes = this.mapearImagenes(createDestinoDto.imagenes) ?? [];
    return this.destinosRepository.save(destino);
=======
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
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(): Promise<Destino[]> {
    return this.destinosRepository.find({
      relations: { imagenes: true },
<<<<<<< HEAD
<<<<<<< HEAD
      order: { nombre: 'ASC' },
=======
      order: {
        nombre: 'ASC',
      },
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
=======
      order: { nombre: 'ASC' },
>>>>>>> 4b183ba (modificacion de imagenes,paquetes y pagos)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4b183ba (modificacion de imagenes,paquetes y pagos)
    if (!destino) throw new NotFoundException('El destino no existe');
=======

    if (!destino) {
      throw new NotFoundException('El destino no existe');
    }

>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
    return destino;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, updateData: any): Promise<Destino> {
    const destino = await this.findOne(id);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4b183ba (modificacion de imagenes,paquetes y pagos)
    const { imagenes, ...resto } = updateDestinoDto;
    Object.assign(destino, resto);
    const imagenesMapeadas = this.mapearImagenes(imagenes);
    if (imagenesMapeadas !== undefined) {
      destino.imagenes = imagenesMapeadas;
    }
    return this.destinosRepository.save(destino);
=======

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
>>>>>>> 8fa77c4a918b398dfb46fc35998ab05891a97e9e
  }

  // =========================
  // DELETE (soft delete)
  // =========================
  async remove(id: number): Promise<Destino> {
    const destino = await this.findOne(id);
    return this.destinosRepository.softRemove(destino);
  }
}