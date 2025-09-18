import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { OpenAIModule } from './openai/openai.module';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { CollabModule } from './collab/collab.module';
import { TemplatesModule } from './templates/templates.module';
import { StyledTextModule } from './styled-text/styled-text.module';
import { ExportModule } from './export/export.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || 3306),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASS || '',
      database: process.env.MYSQL_DB || 'ai_editor',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    OpenAIModule,
    AssetsModule,
    AuthModule,
    ProjectsModule,
    CollabModule,
    TemplatesModule,
    StyledTextModule,
    ExportModule,
  ],
})
export class AppModule {}
