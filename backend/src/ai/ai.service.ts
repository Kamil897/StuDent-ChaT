import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  async getAnswer(userId: string, message: string): Promise<string> {
    const systemPrompt = `
Ты — учебный помощник. Отвечай ТОЛЬКО на вопросы об обучении, институтах, курсах, группах и ИТ-направлениях.
Если вопрос не по теме — вежливо откажись отвечать.
Отвечай ясно, кратко и по делу. Не выдумывай.`;

    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'phi3',
        stream: false,
        prompt: `${systemPrompt}\n\nВопрос пользователя: ${message}`
      });

      const reply = response.data?.response?.trim();

      if (!reply) {
        return 'Ответ отсутствует.';
      }

      return reply;
    } catch (error) {
      console.error('Ошибка при обращении к Ollama:', error.message);
      return 'Ошибка при получении ответа от ИИ.';
    }
  }
}
