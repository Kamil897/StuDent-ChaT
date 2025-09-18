import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/templates')
export class TemplatesController {
  @Get()
  list() {
    return [
      {
        id: 'business-card',
        name: 'Визитка',
        items: [
          { id: 1, type: 'text', text: 'Иван Иванов', x: 100, y: 120, fontSize: 28 },
          { id: 2, type: 'text', text: 'Frontend Developer', x: 100, y: 160, fontSize: 18 },
        ],
      },
      {
        id: 'poster',
        name: 'Постер',
        items: [
          { id: 1, type: 'text', text: 'AI Conference 2025', x: 320, y: 100, fontSize: 36 },
        ],
      },
      {
        id: 'presentation',
        name: 'Презентация',
        items: [
          { id: 1, type: 'text', text: 'Заголовок слайда', x: 200, y: 80, fontSize: 32 },
          { id: 2, type: 'text', text: 'Пункт 1', x: 200, y: 140, fontSize: 20 },
          { id: 3, type: 'text', text: 'Пункт 2', x: 200, y: 180, fontSize: 20 },
        ],
      },
    ];
  }
}

