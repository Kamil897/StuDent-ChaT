import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const hashed_password = await bcrypt.hash(createAdminDto.password, 10);

    const data = {
      username: createAdminDto.username,
      email: createAdminDto.email,
      hashed_password,
      is_active: true,
      is_creator: false,
      first_name: createAdminDto.first_name || '',
      last_name: createAdminDto.last_name || '',
    };

    try {
      return await this.prismaService.admin.create({ data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Admin with this email or username already exists.'
        );
      }
      throw new BadRequestException('Error creating admin.');
    }
  }

  async findAll(): Promise<Admin[]> {
    return await this.prismaService.admin.findMany();
  }

  async findOne(id: number): Promise<Admin> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid admin ID');
    }

    const admin = await this.prismaService.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.prismaService.admin.findUnique({ where: { email } });
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto
  ): Promise<Admin> {
    try {
      return await this.prismaService.admin.update({
        where: { id },
        data: updateAdminDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update admin');
    }
  }

  async remove(id: number): Promise<Admin> {
    return await this.prismaService.admin.delete({ where: { id } });
  }

  async getToken(admin: Admin): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
      email: admin.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.updateRefreshToken(admin.id, hashedRefresh);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(
    id: number,
    hashed_refresh_token: string | null
  ): Promise<Admin> {
    return await this.prismaService.admin.update({
      where: { id },
      data: { hashed_refresh_token },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<Admin | null> {
    const admins = await this.prismaService.admin.findMany({
      select: { id: true, hashed_refresh_token: true },
    });

    for (const admin of admins) {
      if (
        admin.hashed_refresh_token &&
        (await bcrypt.compare(refreshToken, admin.hashed_refresh_token))
      ) {
        return await this.findOne(admin.id);
      }
    }

    return null;
  }
}
