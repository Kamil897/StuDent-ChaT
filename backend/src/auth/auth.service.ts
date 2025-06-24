import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.User.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.hashed_password))) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.User.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const hashed_password = await bcrypt.hash(dto.password, 10);
    await this.prisma.User.create({
      data: {
        username: dto.username,
        email: dto.email,
        hashed_password,
        number: dto.number || '',
        role: 'USER',
      },
    });

    return { message: 'Успешная регистрация' };
  }
}
