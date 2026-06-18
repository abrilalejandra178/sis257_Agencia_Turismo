import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago, EstadoPago } from './entities/pago.entity';
import { Reserva, EstadoReserva } from 'src/reservas/entities/reserva.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { esFechaAnterierAHoy } from 'src/common/utils/fecha.util';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago) private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Reserva) private readonly reservaRepository: Repository<Reserva>,
  ) {}

  // CAMBIO (requisito #5): si el cliente entrega un monto mayor al que
  // debía pagar, se calcula el cambio/vuelto que se le debe devolver.
  private calcularCambio(monto: number, montoRecibido?: number): number {
    if (!montoRecibido || montoRecibido <= monto) return 0;
    return Number((montoRecibido - monto).toFixed(2));
  }

  // CAMBIO: cada vez que se registra (o confirma) un pago completado,
  // se refleja automáticamente en la reserva: sube el adelanto, baja el
  // saldo pendiente y el estado pasa a "adelantado" (pago parcial) o
  // "pagada" (saldo en cero). Antes esto había que hacerlo a mano editando
  // la reserva, lo que dejaba los datos desincronizados.
  private async aplicarPagoAReserva(idReserva: number, montoPago: number): Promise<void> {
    const reserva = await this.reservaRepository.findOneBy({ id: idReserva });
    if (!reserva) return;
    if (reserva.estado === EstadoReserva.CANCELADA) return;

    const total = Number(reserva.total);
    const nuevoAdelanto = Math.min(Number(reserva.adelanto) + Number(montoPago), total);
    reserva.adelanto = nuevoAdelanto;
    reserva.saldoPendiente = Number((total - nuevoAdelanto).toFixed(2));

    if (reserva.saldoPendiente <= 0) {
      reserva.estado = EstadoReserva.PAGADA;
    } else if (nuevoAdelanto > 0) {
      reserva.estado = EstadoReserva.ADELANTADO;
    }

    await this.reservaRepository.save(reserva);
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
    const pagoGuardado = await this.pagoRepository.save(pago);

    // CAMBIO: si el pago ya está completado, se aplica de inmediato al
    // saldo de la reserva (adelanto/saldo pendiente/estado).
    if (pagoGuardado.estadoPago === EstadoPago.COMPLETADO) {
      await this.aplicarPagoAReserva(pagoGuardado.idReserva, Number(pagoGuardado.monto));
    }

    return pagoGuardado;
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
    const estabaCompletado = pago.estadoPago === EstadoPago.COMPLETADO;

    Object.assign(pago, updatePagoDto);
    if (updatePagoDto.montoRecibido !== undefined) {
      pago.cambio = this.calcularCambio(pago.monto, updatePagoDto.montoRecibido);
    }
    const pagoGuardado = await this.pagoRepository.save(pago);

    // CAMBIO: si el pago recién queda como "completado" (antes no lo
    // estaba), se aplica al saldo de la reserva en ese momento.
    if (!estabaCompletado && pagoGuardado.estadoPago === EstadoPago.COMPLETADO) {
      await this.aplicarPagoAReserva(pagoGuardado.idReserva, Number(pagoGuardado.monto));
    }

    return pagoGuardado;
  }

  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagoRepository.softRemove(pago);
  }
}
