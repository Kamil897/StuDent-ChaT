import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async ask(@Body() body: { userId: string; message: string }) {
    const { userId, message } = body;
    const reply = await this.aiService.getAnswer(userId, message);
    return { reply };
  }
}
