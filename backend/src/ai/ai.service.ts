import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  async getAnswer(userId: string, message: string): Promise<string> {
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'phi3',
        prompt: message,
        stream: false
      });

      return response.data.response.trim();
    } catch (error) {
      console.error('Ошибка при обращении к Ollama:', error.message);
      return 'Произошла ошибка при получении ответа от ИИ.';
    }
  }
}
