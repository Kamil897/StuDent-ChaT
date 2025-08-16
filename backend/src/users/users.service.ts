import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { username: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        hashed_password: hashedPassword,
      },
    });
  }
}
