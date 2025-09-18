import { Controller, Post, Body, Get, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from './assets.service';

@Controller('api')
export class AssetsController {
  constructor(private readonly openai: OpenAIService, private readonly assets: AssetsService) {}

  @Post('generate-text')
  async generateText(@Body('prompt') prompt: string) {
    if (!prompt) throw new BadRequestException('prompt required');
    const text = await this.openai.generateText(prompt);
    return { text };
  }

  @Post('generate-image')
  async generateImage(@Body('prompt') prompt: string) {
    if (!prompt) throw new BadRequestException('prompt required');
    const result = await this.openai.generateImage(prompt, '1024x1024');
    if ((result as any).b64) {
      const saved = await this.assets.uploadBase64AndSave((result as any).b64, prompt);
      return { asset: saved };
    }
    if ((result as any).url) {
      const saved = await this.assets.saveAsset((result as any).url, prompt);
      return { asset: saved };
    }
    throw new BadRequestException('Unexpected image result');
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('prompt') prompt?: string) {
    if (!file) throw new BadRequestException('file required');
    const fs = require('fs');
    const buffer = fs.readFileSync(file.path);
    const b64 = buffer.toString('base64');
    const saved = await this.assets.uploadBase64AndSave(b64, prompt, file.originalname);
    fs.unlinkSync(file.path);
    return { asset: saved };
  }

  @Get('assets')
  async getAssets() {
    return this.assets.listAll();
  }
}
