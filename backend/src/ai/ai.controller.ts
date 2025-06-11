import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async ask(@Body() body: { userId: string; message: string }) {
    const { userId, message } = body;

    if (!userId || !message?.trim()) {
      throw new BadRequestException('Необходимы userId и сообщение.');
    }

    const reply = await this.aiService.getAnswer(userId, message);
    return { reply };
  }
}
