import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoReserva } from 'src/enums/estado-reserva.enum';
import { Extra } from 'src/extras/entities/extra.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva) private reservaRepository: Repository<Reserva>,
    @InjectRepository(PaquetesTuristico) private paqueteRepository: Repository<PaquetesTuristico>,
    @InjectRepository(Extra) private extraRepository: Repository<Extra>,
  ) {}

  private async cargarExtras(ids?: number[]): Promise<Extra[]> {
    if (!ids?.length) return [];
    return this.extraRepository.findBy({ id: In(ids) });
  }

  private calcularTotal(
    paquete: PaquetesTuristico | null,
    cantidad: number,
    extras: Extra[],
  ): number {
    const base = paquete ? Number(paquete.precio) * cantidad : 0;
    const extrasTotal = extras.reduce((sum, extra) => sum + Number(extra.precio), 0);
    return base + extrasTotal;
  }

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    let reserva = await this.reservaRepository.findOneBy({
      fechaReserva: createReservaDto.fechaReserva,
      cantidadPersonas: createReservaDto.cantidadPersonas,
      total: createReservaDto.total,
      estado: createReservaDto.estado,
      idUsuario: createReservaDto.idUsuario,
      idPaquete: createReservaDto.idPaquete,
    });
    if (reserva) throw new ConflictException('La reserva ya existe');

    reserva = new Reserva();
    Object.assign(reserva, createReservaDto);

    const paquete = createReservaDto.idPaquete
      ? await this.paqueteRepository.findOneBy({ id: createReservaDto.idPaquete })
      : null;

    reserva.extras = await this.cargarExtras(createReservaDto.idsExtras);
    reserva.total = this.calcularTotal(paquete, createReservaDto.cantidadPersonas, reserva.extras);

    return this.reservaRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      relations: { usuario: true, paquetesTuristicos: true, cliente: true, extras: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: { usuario: true, paquetesTuristicos: true, cliente: true, extras: true },
    });
    if (!reserva) throw new NotFoundException('La reserva no existe');
    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    const idPaquete = updateReservaDto.idPaquete ?? reserva.idPaquete;
    const cantidad = updateReservaDto.cantidadPersonas ?? reserva.cantidadPersonas;
    const paquete = await this.paqueteRepository.findOneBy({ id: idPaquete });

    Object.assign(reserva, updateReservaDto);

    if (updateReservaDto.idsExtras !== undefined) {
      reserva.extras = await this.cargarExtras(updateReservaDto.idsExtras);
    }

    reserva.total = this.calcularTotal(paquete, cantidad, reserva.extras ?? []);

    return this.reservaRepository.save(reserva);
  }

  async cancelar(id: number, motivo?: string): Promise<Reserva> {
    const reserva = await this.findOne(id);

    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new ConflictException('La reserva ya fue cancelada');
    }

    reserva.estado = EstadoReserva.CANCELADA;
    if (motivo) {
      reserva.motivoCancelacion = motivo;
    }

    return this.reservaRepository.save(reserva);
  }
}
