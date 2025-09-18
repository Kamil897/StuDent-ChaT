import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { StorageModule } from '../storage/storage.module';
import { OpenAIService } from '../openai/openai.service';
@Module({
  imports: [TypeOrmModule.forFeature([Asset]), StorageModule],
  controllers: [AssetsController],
  providers: [AssetsService,OpenAIService],
  exports: [AssetsService,OpenAIService],
})
export class AssetsModule {}
