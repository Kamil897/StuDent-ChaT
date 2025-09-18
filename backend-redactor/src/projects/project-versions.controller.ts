import { BadRequestException, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Project } from './project.entity';
import { ProjectVersion } from './project-version.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectVersionsController {
  constructor(
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(ProjectVersion) private readonly versions: Repository<ProjectVersion>,
  ) {}

  @Get(':id/versions')
  async list(@Req() req: any, @Param('id') id: number) {
    const project = await this.projects.findOne({ where: { id: Number(id), userId: req.user.id } });
    if (!project) throw new BadRequestException('Project not found');
    return this.versions.find({ where: { projectId: project.id }, order: { created_at: 'DESC' } });
  }

  @Post(':id/restore/:versionId')
  async restore(@Req() req: any, @Param('id') id: number, @Param('versionId') versionId: number) {
    const project = await this.projects.findOne({ where: { id: Number(id), userId: req.user.id } });
    if (!project) throw new BadRequestException('Project not found');
    const v = await this.versions.findOne({ where: { id: Number(versionId), projectId: project.id } });
    if (!v) throw new BadRequestException('Version not found');
    project.items = v.items;
    const saved = await this.projects.save(project);
    return { project: saved };
  }
}

