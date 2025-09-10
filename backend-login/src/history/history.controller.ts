import { Body, Controller, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AddHistoryDto } from './dto/add-history.dto';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('add')
  async add(@Body() dto: AddHistoryDto) {
    return this.historyService.addRecord({
      userId: dto.userId,
      examType: dto.examType,
      result: dto.result,
    });
  }
}

