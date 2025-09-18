import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Project } from './project.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectsController {
  constructor(@InjectRepository(Project) private readonly projects: Repository<Project>) {}

  @Get()
  async list(@Req() req: any) {
    return this.projects.find({ where: { userId: req.user.id }, order: { updated_at: 'DESC' } });
  }

  @Post()
  async save(@Req() req: any, @Body() body: { id?: number; name: string; items: any[]; metadata?: any }) {
    const entity = this.projects.create({
      id: body.id,
      userId: req.user.id,
      name: body.name,
      items: body.items || [],
      metadata: body.metadata ?? null,
    });
    const saved = await this.projects.save(entity);
    return { project: saved };
  }
}

