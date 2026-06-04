import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva, EstadoReserva } from 'src/reservas/entities/reserva.entity';
import { Pago, EstadoPago } from 'src/pagos/entities/pago.entity';
import { PaquetesTuristico } from 'src/paquetes_turisticos/entities/paquetes_turistico.entity';
import { CrearVentaDto, ConfirmarPagoDto } from './dto/crear-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(PaquetesTuristico)
    private readonly paqueteRepository: Repository<PaquetesTuristico>,
  ) {}

  async crearVenta(crearVentaDto: CrearVentaDto, idUsuario?: number): Promise<Reserva> {
    const { nombreCliente, telefonoCliente, emailCliente, items, notas, fechaViaje } = crearVentaDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Debe agregar al menos un paquete a la venta');
    }

    let total = 0;
    let totalPersonas = 0;
    let idPaquetePrincipal: number | null = null;
    let paquetePrincipal: PaquetesTuristico | null = null;

    // Validar cada item y calcular totales
    for (const item of items) {
      const paquete = await this.paqueteRepository.findOne({
        where: { id: item.idPaquete },
      });

      if (!paquete) {
        throw new BadRequestException(`Paquete con ID ${item.idPaquete} no encontrado`);
      }

      // Validar capacidad máxima
      if (item.cantidadPersonas > paquete.capacidadMaxima) {
        throw new BadRequestException(
          `El paquete "${paquete.nombre}" tiene capacidad máxima de ${paquete.capacidadMaxima} personas`,
        );
      }

      const precioUnitario = Number(paquete.precio);
      total += precioUnitario * item.cantidadPersonas;
      totalPersonas += item.cantidadPersonas;

      // Guardar el primer paquete como principal (para la relación ManyToOne)
      if (!idPaquetePrincipal) {
        idPaquetePrincipal = item.idPaquete;
        paquetePrincipal = paquete;
      }
    }

    // Crear la reserva
    const reserva = new Reserva();
    reserva.nombreCliente = nombreCliente;
    reserva.telefonoCliente = telefonoCliente;
    reserva.emailCliente = emailCliente;
    reserva.fechaReserva = new Date();
    if (fechaViaje) {
      reserva.fechaViaje = new Date(fechaViaje);
    }
    reserva.cantidadPersonas = totalPersonas;
    reserva.total = total;
    reserva.adelanto = 0;
    reserva.saldoPendiente = total;
    reserva.estado = EstadoReserva.PENDIENTE;
    reserva.notas = notas;
    reserva.idPaquete = idPaquetePrincipal!;
    reserva.paquetesTuristicos = paquetePrincipal!;
    if (idUsuario) {
      reserva.idUsuario = idUsuario;
    }

    return this.reservaRepository.save(reserva);
  }

  async obtenerReserva(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: { paquetesTuristicos: true, pagos: true },
    });

    if (!reserva) {
      throw new BadRequestException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async confirmarPago(idReserva: number, confirmarPagoDto: ConfirmarPagoDto): Promise<Pago> {
    const reserva = await this.obtenerReserva(idReserva);

    const { metodoPago, referenciaPago } = confirmarPagoDto;

    // Pago total directo - siempre paga el monto completo de la reserva
    const montoTotal = Number(reserva.total);

    // Crear el pago
    const pago = new Pago();
    pago.monto = montoTotal;
    pago.fechaPago = new Date();
    pago.metodoPago = metodoPago;
    pago.estadoPago = EstadoPago.COMPLETADO;
    pago.referenciaPago = referenciaPago;
    pago.idReserva = idReserva;

    const pagoGuardado = await this.pagoRepository.save(pago);

    // Actualizar la reserva como pagada completamente
    reserva.adelanto = montoTotal;
    reserva.saldoPendiente = 0;
    reserva.estado = EstadoReserva.PAGADA;

    await this.reservaRepository.save(reserva);

    return pagoGuardado;
  }

  async obtenerVentas(filtro?: 'hoy' | 'semana' | 'mes' | 'todos'): Promise<Reserva[]> {
    const query = this.reservaRepository
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.paquetesTuristicos', 'paquete')
      .leftJoinAndSelect('reserva.pagos', 'pago')
      .orderBy('reserva.fechaCreacion', 'DESC');

    if (filtro === 'hoy') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      query.where('reserva.fechaCreacion >= :fecha', { fecha: hoy });
    } else if (filtro === 'semana') {
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      hace7Dias.setHours(0, 0, 0, 0);
      query.where('reserva.fechaCreacion >= :fecha', { fecha: hace7Dias });
    } else if (filtro === 'mes') {
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      hace30Dias.setHours(0, 0, 0, 0);
      query.where('reserva.fechaCreacion >= :fecha', { fecha: hace30Dias });
    }

    return query.getMany();
  }

  async obtenerReporteVentas(filtro?: 'hoy' | 'semana' | 'mes' | 'todos'): Promise<{
    totalVentas: number;
    totalPagado: number;
    totalPendiente: number;
    cantidadReservas: number;
    detalleVentas: any[];
  }> {
    const ventas = await this.obtenerVentas(filtro);

    const totalVentas = ventas.reduce((sum, v) => sum + Number(v.total), 0);
    const totalPagado = ventas.reduce((sum, v) => sum + Number(v.adelanto), 0);
    const totalPendiente = ventas.reduce((sum, v) => sum + Number(v.saldoPendiente), 0);

    return {
      totalVentas,
      totalPagado,
      totalPendiente,
      cantidadReservas: ventas.length,
      detalleVentas: ventas.map(v => ({
        id: v.id,
        nombreCliente: v.nombreCliente,
        paquete: v.paquetesTuristicos.nombre,
        total: v.total,
        adelanto: v.adelanto,
        saldoPendiente: v.saldoPendiente,
        estado: v.estado,
        fechaReserva: v.fechaReserva,
        cantidadPersonas: v.cantidadPersonas,
      })),
    };
  }

  async cancelarReserva(idReserva: number): Promise<Reserva> {
    const reserva = await this.obtenerReserva(idReserva);

    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException('Esta reserva ya fue cancelada');
    }

    reserva.estado = EstadoReserva.CANCELADA;
    return this.reservaRepository.save(reserva);
  }
}
