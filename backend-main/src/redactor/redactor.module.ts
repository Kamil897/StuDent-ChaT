import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { RedactorAiController } from './ai.controller';
import { RedactorAiService } from './redactorAi.service';

@Module({
  controllers: [AssetsController, ProjectsController, RedactorAiController],
  providers: [AssetsService, ProjectsService, RedactorAiService, PrismaService],
})
export class RedactorModule {}

