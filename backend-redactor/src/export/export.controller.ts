import { BadRequestException, Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('api/export')
export class ExportController {
  @Post('png')
  async exportPng(@Body('dataUrl') dataUrl: string, @Res() res: Response) {
    if (!dataUrl?.startsWith('data:image/png')) throw new BadRequestException('Invalid dataUrl');
    const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buf = Buffer.from(b64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="canvas.png"');
    return res.end(buf);
  }

  @Post('svg')
  async exportSvg(@Body('svg') svg: string, @Res() res: Response) {
    if (!svg?.includes('<svg')) throw new BadRequestException('Invalid svg');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="canvas.svg"');
    return res.end(svg);
  }
}

