import { Controller, Post, Body, Get, UploadedFile, UseInterceptors, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class AssetsController {
  constructor(private readonly openai: OpenAIService, private readonly assets: AssetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-text')
  async generateText(@Body('prompt') prompt: string) {
    if (!prompt) throw new BadRequestException('prompt required');
    const text = await this.openai.generateText(prompt);
    return { text };
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-image')
  async generateImage(@Req() req: any, @Body('prompt') prompt: string) {
    if (!prompt) throw new BadRequestException('prompt required');
    const result = await this.openai.generateImage(prompt, '1024x1024');
    if ((result as any).b64) {
      const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, (result as any).b64, prompt);
      return { asset: saved };
    }
    if ((result as any).url) {
      const saved = await this.assets.saveAssetForUser(req.user.id, (result as any).url, prompt);
      return { asset: saved };
    }
    throw new BadRequestException('Unexpected image result');
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body('prompt') prompt?: string) {
    if (!file) throw new BadRequestException('file required');
    const fs = require('fs');
    const buffer = fs.readFileSync(file.path);
    const b64 = buffer.toString('base64');
    const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, b64, prompt, file.originalname);
    fs.unlinkSync(file.path);
    return { asset: saved };
  }

  @UseGuards(JwtAuthGuard)
  @Get('assets')
  async getAssets(@Req() req: any) {
    return this.assets.listAllForUser(req.user.id);
  }
}
