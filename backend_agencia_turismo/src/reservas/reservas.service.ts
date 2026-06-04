import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservasService {
  constructor(@InjectRepository(Reserva) private reservaRepository: Repository<Reserva>) {}
  
  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
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

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);
    Object.assign(reserva, updateReservaDto);
    return this.reservaRepository.save(reserva);
  }

  async remove(id: number): Promise<void> {
    const reserva = await this.findOne(id);
    await this.reservaRepository.softRemove(reserva);
  }
}
