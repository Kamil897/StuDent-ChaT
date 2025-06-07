import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(emailOrUsername: string, password: string, role: string) {
    const where =
      ['admin', 'user'].includes(role)
        ? { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] }
        : { email: emailOrUsername };

    let user: any;

    switch (role) {
      case 'admin':
        user = await this.prisma.Admin.findFirst({ where });
        break;
      case 'user':
        user = await this.prisma.User.findFirst({ where });
        break;
      case 'teacher':
        user = await this.prisma.Teacher.findUnique({ where });
        break;
      case 'parent':
        user = await this.prisma.Parent.findUnique({ where });
        break;
      default:
        throw new ForbiddenException('Недопустимая роль');
    }

    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
      console.warn(`❌ Неверные данные для входа: ${emailOrUsername} (${role})`);
      throw new UnauthorizedException('Неверный email/пароль');
    }

    console.log(`✅ Вход выполнен: ${user.email} (${role})`);

    return this.createToken(user.id, role);
  }

  async register(dto: RegisterDto) {
    const { email, role } = dto;

    let existing: any;

    switch (role) {
      case 'admin':
        existing = await this.prisma.Admin.findUnique({ where: { email } });
        break;
      case 'user':
        existing = await this.prisma.User.findUnique({ where: { email } });
        break;
      case 'teacher':
        existing = await this.prisma.Teacher.findUnique({ where: { email } });
        break;
      case 'parent':
        existing = await this.prisma.Parent.findUnique({ where: { email } });
        break;
      default:
        throw new ForbiddenException('Недопустимая роль');
    }

    if (existing) {
      throw new ForbiddenException('Пользователь с таким email уже существует');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const username = dto.username || `${email.split('@')[0]}_${Date.now()}`;

    const baseData = {
      email,
      username,
      hashed_password: hashed,
    };

    const extendedData = {
      ...baseData,
      phone_number: '',
      gender: 'other',
      birthday: '',
    };

    let created: any;

    switch (role) {
      case 'admin':
        created = await this.prisma.Admin.create({ data: baseData });
        break;
      case 'user':
        created = await this.prisma.User.create({ data: baseData });
        break;
      case 'teacher':
        created = await this.prisma.Teacher.create({ data: extendedData });
        break;
      case 'parent':
        created = await this.prisma.Parent.create({ data: extendedData });
        break;
    }

    console.log(`✅ Регистрация успешна: ${created.email} (${role})`);

    return this.createToken(created.id, role);
  }

  private async createToken(id: number, role: string) {
    const payload = { sub: id, role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refresh_token, 10);

    await this.prisma[role].update({
      where: { id },
      data: { hashed_refresh_token: hashedRefresh },
    });

    return { access_token, refresh_token };
  }

  async refreshTokens(id: number, role: string, refresh_token: string) {
    const user = await this.prisma[role].findUnique({ where: { id } });

    if (!user || !user.hashed_refresh_token) {
      throw new ForbiddenException('Доступ запрещён');
    }

    const isValid = await bcrypt.compare(refresh_token, user.hashed_refresh_token);
    if (!isValid) {
      throw new ForbiddenException('Недопустимый refresh токен');
    }

    return this.createToken(id, role);
  }
}
