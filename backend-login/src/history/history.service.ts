import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async addRecord(data: { userId: number; examType: 'ielts-writing' | 'ielts-reading'; result: any }) {
    return (this.prisma as any).history.create({
      data: {
        userId: data.userId,
        examType: data.examType,
        result: data.result,
      },
    });
  }
}

