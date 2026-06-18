import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { ILike, Repository } from 'typeorm';
import { esFechaAnterierAHoy } from 'src/common/utils/fecha.util';

@Injectable()
export class ReservasService {
  constructor(@InjectRepository(Reserva) private reservaRepository: Repository<Reserva>) {}
  
  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    // CAMBIO (requisito #6): no se permite registrar una reserva con
    // fecha de reserva o fecha de viaje anterior al día de hoy.
    if (esFechaAnterierAHoy(createReservaDto.fechaReserva)) {
      throw new BadRequestException('La fecha de reserva no puede ser anterior al día de hoy');
    }
    if (createReservaDto.fechaViaje && esFechaAnterierAHoy(createReservaDto.fechaViaje)) {
      throw new BadRequestException('La fecha de viaje no puede ser anterior al día de hoy');
    }

    let reserva = await this.reservaRepository.findOneBy({
      fechaReserva: createReservaDto.fechaReserva,
      cantidadPersonas: createReservaDto.cantidadPersonas,
      total: createReservaDto.total,
      adelanto: createReservaDto.adelanto,
      saldoPendiente: createReservaDto.saldoPendiente,
      estado: createReservaDto.estado,
      idUsuario: createReservaDto.idUsuario,
      idPaquete: createReservaDto.idPaquete
    });
    if (reserva) throw new ConflictException('La reserva ya existe');

    reserva = new Reserva();
    Object.assign(reserva, createReservaDto);
    return this.reservaRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({ relations: { usuario: true, paquetesTuristicos: true }, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({ 
      where: { id }, relations: { usuario: true, paquetesTuristicos: true }
    });
    if (!reserva) throw new NotFoundException('La reserva no existe');
    return reserva;
  }

  // CAMBIO (requisito #7): búsqueda de cliente por nombre, teléfono o
  // email para saber si ya tiene reservas anteriores (cliente frecuente).
  async buscarPorCliente(query: string): Promise<{
    totalReservas: number;
    esClienteFrecuente: boolean;
    reservas: Reserva[];
  }> {
    const UMBRAL_CLIENTE_FRECUENTE = 2;
    const texto = query?.trim();

    if (!texto) {
      return { totalReservas: 0, esClienteFrecuente: false, reservas: [] };
    }

    const reservas = await this.reservaRepository.find({
      where: [
        { nombreCliente: ILike(`%${texto}%`) },
        { telefonoCliente: ILike(`%${texto}%`) },
        { emailCliente: ILike(`%${texto}%`) },
      ],
      relations: { paquetesTuristicos: true },
      order: { fechaCreacion: 'DESC' },
    });

    return {
      totalReservas: reservas.length,
      esClienteFrecuente: reservas.length >= UMBRAL_CLIENTE_FRECUENTE,
      reservas,
    };
  }

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    // CAMBIO (requisito #6): tampoco se permite mover la fecha de
    // reserva/viaje a una fecha pasada cuando se está editando.
    if (updateReservaDto.fechaReserva && esFechaAnterierAHoy(updateReservaDto.fechaReserva)) {
      throw new BadRequestException('La fecha de reserva no puede ser anterior al día de hoy');
    }
    if (updateReservaDto.fechaViaje && esFechaAnterierAHoy(updateReservaDto.fechaViaje)) {
      throw new BadRequestException('La fecha de viaje no puede ser anterior al día de hoy');
    }

    Object.assign(reserva, updateReservaDto);
    return this.reservaRepository.save(reserva);
  }

  // CAMBIO (requisito #2): al eliminar (dar de baja) una reserva se
  // guarda el motivo antes de hacer el soft-delete.
  async remove(id: number, motivo?: string): Promise<void> {
    const reserva = await this.findOne(id);
    if (motivo) {
      reserva.motivoCancelacion = motivo;
      await this.reservaRepository.save(reserva);
    }
    await this.reservaRepository.softRemove(reserva);
  }
}
