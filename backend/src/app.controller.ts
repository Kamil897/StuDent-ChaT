import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // путь должен быть относительным от app.controller.ts
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdmin(@Req() req) {
    return `Hello Admin ${req.user.email}`;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('teacher')
  getTeacher(@Req() req) {
    return `Hello Teacher ${req.user.email}`;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('user')
  getUser(@Req() req) {
    return `Hello User ${req.user.email}`;
  }
}
