import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    let cliente = await this.clienteRepository.findOneBy({ email: createClienteDto.email });
    if (cliente) throw new ConflictException('Ya existe un cliente con ese email');

    cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('El cliente no existe');
    return cliente;
  }

  async search(query: string): Promise<Cliente[]> {
    return this.clienteRepository
      .createQueryBuilder('cliente')
      .where('LOWER(cliente.nombre) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(cliente.apellido) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(cliente.email) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('cliente.telefono LIKE :query', { query: `%${query}%` })
      .limit(10)
      .getMany();
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.softRemove(cliente);
  }
}
