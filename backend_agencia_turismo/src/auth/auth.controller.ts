import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  readonly nombre: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  readonly contraseña: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.nombre, loginDto.contraseña);
  }
}