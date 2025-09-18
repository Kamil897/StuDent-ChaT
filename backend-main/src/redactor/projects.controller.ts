import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';

@UseGuards(JwtAuthGuard)
@Controller('api/redactor/projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.projects.listByUser(req.user.id);
  }

  @Post()
  async save(
    @Req() req: any,
    @Body() body: { id?: number; name: string; items?: any }
  ) {
    return this.projects.saveProject(req.user.id, body);
  }
}

