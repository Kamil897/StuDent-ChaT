import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ask')
  async ask(
    @Body('message') message: string,
    @Body('userId') userId: string = 'defaultUser',
    @Body('style') style: string = 'default',
    @Body('history') history?: any[],
    @Req() req?: any,
  ) {
    if (!message) {
      return { error: 'Message is required' };
    }
    const resolvedUserId = req?.user?.id ? String(req.user.id) : userId;
    return this.aiService.ask(resolvedUserId, message, style, history);
  }
}
