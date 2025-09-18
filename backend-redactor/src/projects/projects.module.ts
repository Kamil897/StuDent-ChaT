import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Layer } from './layer.entity';
import { EditHistory } from './edit-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Layer, EditHistory])],
})
export class ProjectsModule {}

