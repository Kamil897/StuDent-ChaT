import { Controller, Get, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { Request } from 'express';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async saveMessage(@Req() req: Request & { user: { id: number } }, @Body() body: { question: string; answer: string }) {
    return this.chatService.saveMessage(req.user.id, body.question, body.answer);
  }

  @Get()
  async getHistory(@Req() req: Request & { user: { id: number } }) {
    return this.chatService.getHistory(req.user.id);
  }

  @Delete()
  async clearHistory(@Req() req: Request & { user: { id: number } }) {
    return this.chatService.clearHistory(req.user.id);
  }
}
