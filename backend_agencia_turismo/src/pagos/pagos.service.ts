import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { esFechaAnterierAHoy } from 'src/common/utils/fecha.util';

@Injectable()
export class PagosService {
  constructor(@InjectRepository(Pago) private readonly pagoRepository: Repository<Pago>) {}

  // CAMBIO (requisito #5): si el cliente entrega un monto mayor al que
  // debía pagar, se calcula el cambio/vuelto que se le debe devolver.
  private calcularCambio(monto: number, montoRecibido?: number): number {
    if (!montoRecibido || montoRecibido <= monto) return 0;
    return Number((montoRecibido - monto).toFixed(2));
  }

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    // CAMBIO (requisito #6): no se permite registrar un pago con una
    // fecha de pago anterior al día de hoy.
    if (esFechaAnterierAHoy(createPagoDto.fechaPago)) {
      throw new BadRequestException('La fecha de pago no puede ser anterior al día de hoy');
    }

    let pago = await this.pagoRepository.findOneBy({
      idReserva: createPagoDto.idReserva,
      fechaPago: createPagoDto.fechaPago,
      metodoPago: createPagoDto.metodoPago,
      estadoPago: createPagoDto.estadoPago,
    });
    if (pago) throw new ConflictException('El pago ya existe');

    pago = new Pago();
    Object.assign(pago, createPagoDto);
    pago.cambio = this.calcularCambio(createPagoDto.monto, createPagoDto.montoRecibido);
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
    if (updatePagoDto.montoRecibido !== undefined) {
      pago.cambio = this.calcularCambio(pago.monto, updatePagoDto.montoRecibido);
    }
    return this.pagoRepository.save(pago);
  }

  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagoRepository.softRemove(pago);
  }
}
