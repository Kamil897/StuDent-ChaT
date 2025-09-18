import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from '../assets/assets.service';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class StyledTextController {
  constructor(private readonly openai: OpenAIService, private readonly assets: AssetsService) {}

  @Post('generate-styled-text')
  async generate(@Req() req: any, @Body('text') text: string, @Body('font') font: string, @Body('effect') effect: string) {
    if (!text) throw new BadRequestException('text required');
    const prompt = `Render text as image with font ${font || 'default'} and effect ${effect || 'none'}: ${text}`;
    const result = await this.openai.generateImage(prompt, '1024x256');
    if ((result as any).b64) {
      const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, (result as any).b64, prompt);
      return { asset: saved };
    }
    if ((result as any).url) {
      const saved = await this.assets.saveAssetForUser(req.user.id, (result as any).url, prompt);
      return { asset: saved };
    }
    throw new BadRequestException('Unexpected styled text result');
  }
}

