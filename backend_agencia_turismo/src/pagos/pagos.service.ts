import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PagosService {
  constructor(@InjectRepository(Pago) private readonly pagoRepository: Repository<Pago>) {}

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    let pago = await this.pagoRepository.findOneBy({
      idReserva: createPagoDto.idReserva,
      fechaPago: createPagoDto.fechaPago,
      metodoPago: createPagoDto.metodoPago,
      estadoPago: createPagoDto.estadoPago,
    });
    if (pago) throw new ConflictException('El pago ya existe');

    pago = new Pago();
    Object.assign(pago, createPagoDto);
    return this.pagoRepository.save(pago);
  }

  async findAll(): Promise<Pago[]> {
    return await this.pagoRepository.find({ relations: { reserva: true }, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: { reserva: true },
    });
    if (!pago) throw new ConflictException('El pago no existe');
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.findOne(id);
    Object.assign(pago, updatePagoDto);
    return this.pagoRepository.save(pago);
  }

  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagoRepository.remove(pago);
  }
}
