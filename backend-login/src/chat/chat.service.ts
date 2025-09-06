import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(userId: number, question: string, answer: string) {
    return this.prisma.chatHistory.create({
      data: { userId, question, answer },
    });
  }

  async getHistory(userId: number) {
    return this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async clearHistory(userId: number) {
    return this.prisma.chatHistory.deleteMany({ where: { userId } });
  }
}

