import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    let usuario = await this.usuariosRepository.findOneBy({
      email: createUsuarioDto.email.trim(),
    });
    if (usuario) throw new ConflictException('El usuario ya existe');

    usuario = await this.usuariosRepository.findOneBy({
      usuario: createUsuarioDto.usuario.trim(),
    });
    if (usuario) throw new ConflictException('El nombre de usuario ya existe');

    usuario = new Usuario();
    Object.assign(usuario, createUsuarioDto);
    // Hashear contraseña antes de guardar
    usuario.contraseña = await bcrypt.hash(createUsuarioDto.contraseña, 10);
    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({ order: { email: 'ASC' } });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('El usuario no existe');
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return this.usuariosRepository.softRemove(usuario);
  }

  async findByNombre(nombre: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({ nombre });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({ email });
  }

  async validate(usuario: string, clave: string): Promise<Usuario> {
    const usuarioOk = await this.usuariosRepository.findOneBy({ usuario });
    if (!usuarioOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(clave, usuarioOk.contraseña);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuarioOk;
  }
}
