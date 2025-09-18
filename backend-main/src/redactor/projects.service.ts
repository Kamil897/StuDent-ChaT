import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  listByUser(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, items: true, createdAt: true, updatedAt: true },
    });
  }

  async saveProject(userId: number, data: { id?: number; name: string; items?: any }) {
    if (data.id) {
      const existed = await this.prisma.project.findFirst({ where: { id: data.id, userId } });
      if (!existed) throw new NotFoundException('Project not found');
      return this.prisma.project.update({
        where: { id: data.id },
        data: { name: data.name, items: data.items ?? existed.items },
      });
    }
    return this.prisma.project.create({
      data: { userId, name: data.name, items: data.items ?? [] },
    });
  }
}

