import { Module } from '@nestjs/common';
import { StyledTextController } from './styled-text.controller';
import { OpenAIModule } from '../openai/openai.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [OpenAIModule, AssetsModule],
  controllers: [StyledTextController],
})
export class StyledTextModule {}

