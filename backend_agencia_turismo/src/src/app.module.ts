import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinosModule } from './destinos/destinos.module';
import { GuiasTuristicosModule } from './guias_turisticos/guias_turisticos.module';
import { TransportesModule } from './transportes/transportes.module';
import { PaquetesTuristicosModule } from './paquetes_turisticos/paquetes_turisticos.module';
import { ReservasModule } from './reservas/reservas.module';
import { PagosModule } from './pagos/pagos.module';
import { ResenasModule } from './resenas/resenas.module';
import { AuthModule } from './auth/auth.module';
import { VentasModule } from './ventas/ventas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ItinerariosModule } from './itinerarios/itinerarios.module';
import { ExtrasModule } from './extras/extras.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '*/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsuariosModule,
    DestinosModule,
    GuiasTuristicosModule,
    TransportesModule,
    PaquetesTuristicosModule,
    ReservasModule,
    PagosModule,
    ResenasModule,
    AuthModule,
    VentasModule,
    ClientesModule,
    ItinerariosModule,
    ExtrasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
