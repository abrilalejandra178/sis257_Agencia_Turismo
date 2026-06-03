import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(nombre: string, contraseña: string) {
    const usuario = await this.usuariosService.findByNombre(nombre);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');
    if (usuario.contraseña !== contraseña)
      throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: usuario.id, nombre: usuario.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuario.nombre,
    };
  }
}