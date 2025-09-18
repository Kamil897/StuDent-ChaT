import { Body, Controller, Get, Post, UseGuards, Req, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/redactor/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async listMyAssets(@Req() req: any, @Query('projectId') projectId?: string) {
    const userId: number = req.user.id;
    return this.assetsService.listByUser(userId, projectId ? Number(projectId) : undefined);
  }

  @Post()
  async createAsset(@Req() req: any, @Body() dto: { type: string; url?: string; content?: string; metadata?: any; projectId?: number; }) {
    const userId: number = req.user.id;
    return this.assetsService.createForUser(userId, dto);
  }
}

