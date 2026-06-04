# Backend (NestJS) - AI Agent Instructions

## 🎯 Backend Architecture

**Framework**: NestJS 11 with TypeScript  
**Database**: PostgreSQL via TypeORM  
**Authentication**: JWT (JSON Web Tokens)  
**API Design**: RESTful with URI versioning (`/api/v1/`)  
**Testing**: Jest (unit) + e2e tests  
**Validation**: class-validator decorators  
**Documentation**: Auto-generated Swagger

## 📦 Module Organization

Each feature lives in `src/{featureName}/` with standard structure:

```
src/{feature}/
├── {feature}.module.ts          # NestJS module declaration
├── {feature}.controller.ts      # HTTP endpoints (@Get, @Post, etc.)
├── {feature}.service.ts         # Business logic (dependency injected)
├── {feature}.service.spec.ts    # Unit tests for service
├── {feature}.controller.spec.ts # Unit tests for controller
├── dto/                         # Data transfer objects
│   ├── create-{feature}.dto.ts
│   ├── update-{feature}.dto.ts
│   └── {feature}.dto.ts
├── entities/                    # TypeORM entities (database models)
│   └── {feature}.entity.ts
├── guards/                      # Authentication/authorization (if needed)
├── decorators/                  # Custom decorators (if needed)
├── interfaces/                  # TypeScript interfaces (if needed)
└── strategies/                  # Auth strategies (auth module only)
```

## 🔐 Authentication Pattern

- **Guard**: `@UseGuards(JwtAuthGuard)` on protected endpoints
- **Decorator**: `@CurrentUser()` to inject authenticated user
- **Token**: Stored in request headers as `Authorization: Bearer <token>`
- **Location**: JWT validation happens in `auth/strategies/jwt.strategy.ts`

Example:
```typescript
@Get()
@UseGuards(JwtAuthGuard)
findMyReservations(@CurrentUser() user) {
  return this.reservasService.findByUserId(user.id);
}
```

## 📝 DTO Pattern (Request/Response Validation)

All DTOs use `class-validator` decorators:

```typescript
// src/usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

✅ Always add validation decorators  
✅ DTOs automatically validate incoming requests  
❌ Never skip validation on public endpoints

## 💾 Entity Pattern (Database Models)

TypeORM entities with relationships:

```typescript
// src/paquetes_turisticos/entities/paquete-turistico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';

@Entity('paquetes_turisticos')
export class PaqueteTuristico {
  @PrimaryGeneratedColumn()
  id_paquete: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Destino)
  destino: Destino;
}
```

Key patterns:
- `@Entity('table_name')` - Maps to database table
- `@PrimaryGeneratedColumn()` - Auto-incrementing primary key
- `@Column()` - Standard columns
- `@ManyToOne()`, `@OneToMany()` - Relationships
- Relations auto-populate via TypeORM

## 🎮 Controller Pattern

Always include **TypeScript types** and **return types**:

```typescript
// src/destinos/destinos.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { Destino } from './entities/destino.entity';

@Controller('api/v1/destinos')  // ← MUST include /api/v1/ prefix
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get()
  async findAll(): Promise<Destino[]> {
    return this.destinosService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDestinoDto: CreateDestinoDto): Promise<Destino> {
    return this.destinosService.create(createDestinoDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Destino> {
    return this.destinosService.findOne(+id);
  }
}
```

## 🏢 Service Pattern (Business Logic)

Services use dependency injection and interact with database:

```typescript
// src/destinos/destinos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destino } from './entities/destino.entity';
import { CreateDestinoDto } from './dto/create-destino.dto';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly destinosRepository: Repository<Destino>,
  ) {}

  async findAll(): Promise<Destino[]> {
    return this.destinosRepository.find();
  }

  async findOne(id: number): Promise<Destino> {
    return this.destinosRepository.findOne({ where: { id_destino: id } });
  }

  async create(createDestinoDto: CreateDestinoDto): Promise<Destino> {
    const destino = this.destinosRepository.create(createDestinoDto);
    return this.destinosRepository.save(destino);
  }
}
```

Key patterns:
- `@InjectRepository(Entity)` - Get TypeORM repository
- `repository.find()` - Get all records
- `repository.findOne({ where: {...} })` - Find by condition
- `repository.create()` - Create entity instance
- `repository.save()` - Persist to database

## 🧪 Testing Pattern

Use Jest with `*.spec.ts` files:

```typescript
// src/destinos/destinos.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DestinosService } from './destinos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Destino } from './entities/destino.entity';

describe('DestinosService', () => {
  let service: DestinosService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinosService,
        {
          provide: getRepositoryToken(Destino),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DestinosService>(DestinosService);
  });

  it('should return empty array', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
  });
});
```

Run tests:
```bash
npm run test                    # Watch mode
npm run test:cov               # With coverage
npm run test:e2e               # End-to-end tests
```

## 🔑 Important Rules

| Rule | Example | Reason |
|------|---------|--------|
| **Always include `/api/v1/` prefix** | `@Controller('api/v1/users')` | Versioning strategy |
| **Validate all DTOs** | `@IsEmail()`, `@IsString()` | Data integrity |
| **Protect endpoints** | `@UseGuards(JwtAuthGuard)` | Security |
| **Use TypeScript types** | `async findOne(id: number): Promise<User>` | Type safety |
| **Inject dependencies** | `constructor(private svc: Service)` | Testability |
| **Create unit tests** | `*.service.spec.ts` | Quality assurance |

## 📦 Running Commands

```bash
cd backend_agencia_turismo

# Development
npm run start:dev              # Hot-reload on changes (http://localhost:3000)
npm run start                  # Production mode
npm run start:debug           # Debug mode

# Testing
npm run test                   # Jest watch mode
npm run test:cov              # With coverage report
npm run test:e2e              # End-to-end tests

# Linting
npm run lint                   # ESLint check
npm run format                # Format with Prettier (if configured)

# Database (TypeORM)
# Note: TypeORM synchronizes automatically in dev mode
```

## 🎯 Quick Task: Add New API Endpoint

1. **Create DTO** in `src/{feature}/dto/create-{feature}.dto.ts`:
   ```typescript
   export class CreateFooDto {
     @IsString() name: string;
   }
   ```

2. **Update Entity** if needed in `src/{feature}/entities/{feature}.entity.ts`

3. **Add Service Method** in `src/{feature}/{feature}.service.ts`:
   ```typescript
   async create(createFooDto: CreateFooDto): Promise<Foo> {
     const foo = this.fooRepository.create(createFooDto);
     return this.fooRepository.save(foo);
   }
   ```

4. **Add Controller Method** in `src/{feature}/{feature}.controller.ts`:
   ```typescript
   @Post()
   @UseGuards(JwtAuthGuard)
   async create(@Body() createFooDto: CreateFooDto): Promise<Foo> {
     return this.fooService.create(createFooDto);
   }
   ```

5. **Write Tests** in `*.spec.ts` files

## 🔗 Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Application entry point |
| `src/app.module.ts` | Root module with all feature modules |
| `src/auth/guards/jwt.guard.ts` | JWT authentication logic |
| `nest-cli.json` | NestJS code generation config |
| `package.json` | Dependencies and scripts |

See [QUICK_AGENT_REFERENCE.md](/memories/repo/QUICK_AGENT_REFERENCE.md) for code templates.

---

**Backend Development Ready** ✅
