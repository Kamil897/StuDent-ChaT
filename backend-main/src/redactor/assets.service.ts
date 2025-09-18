import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByUser(userId: number, projectId?: number) {
    return this.prisma.asset.findMany({
      where: { userId, ...(projectId ? { projectId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForUser(userId: number, dto: { type: string; url?: string; content?: string; metadata?: any; projectId?: number; }) {
    return this.prisma.asset.create({
      data: {
        userId,
        projectId: dto.projectId ?? null,
        type: dto.type,
        url: dto.url,
        content: dto.content,
        metadata: dto.metadata,
      },
    });
  }
}

