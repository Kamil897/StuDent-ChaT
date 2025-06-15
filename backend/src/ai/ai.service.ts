import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AiService {
  private requestLog: Map<string, number[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async getAnswer(userId: string, message: string): Promise<string> {
    if (!this.allowRequest(userId)) {
      throw new ForbiddenException('Слишком много запросов. Повторите позже.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: +userId } });

    if (!user) {
      return 'Пользователь не найден.';
    }
    
    const systemPrompt = `
    Ты — учебный ассистент. Отвечай строго по теме: учёба, ИТ-направления, институты, курсы, студенческая жизнь.
    Игнорируй вопросы вне этой темы. Отвечай ясно и кратко.
    Институт: ${user.institution || 'не указан'}
    Интересы: ${user.interests || 'не указаны'}
    `;
  
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'phi3',
        prompt: `${systemPrompt}\nВопрос: ${message}`,
        stream: false
      });

      return response.data.response.trim();
    } catch (error) {
      console.error('Ошибка при обращении к Ollama:', error.message);
      return 'Ошибка ИИ-сервера. Повторите позже.';
    }
  }

  private allowRequest(userId: string): boolean {
    const now = Date.now();
    const minuteAgo = now - 60_000;
    const log = this.requestLog.get(userId) || [];

    const recent = log.filter((t) => t > minuteAgo);
    if (recent.length >= 10) return false;

    recent.push(now);
    this.requestLog.set(userId, recent);
    return true;
  }
}
