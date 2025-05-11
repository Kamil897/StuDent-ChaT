import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { username: string; email: string }) {
    return this.prisma.user.create({ data });
  }
}