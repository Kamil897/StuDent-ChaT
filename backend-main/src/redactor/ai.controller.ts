import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RedactorAiService } from './redactorAi.service';

@UseGuards(JwtAuthGuard)
@Controller('api/redactor/ai')
export class RedactorAiController {
  constructor(private readonly ai: RedactorAiService) {}

  @Post('generate-background')
  async generateBackground(@Req() req: any, @Body() body: { prompt: string }) {
    const asset = await this.ai.generateBackground(req.user.id, body.prompt, { width: 1920, height: 1080 });
    return asset;
  }

  @Post('inpaint')
  async inpaint(
    @Req() req: any,
    @Body() body: { imageBase64: string; maskBase64: string; prompt: string }
  ) {
    return this.ai.inpaint(req.user.id, body);
  }

  @Post('text-style')
  async textStyle(
    @Req() req: any,
    @Body() body: { text: string; stylePrompt: string }
  ) {
    return this.ai.textStyle(req.user.id, body);
  }
}

