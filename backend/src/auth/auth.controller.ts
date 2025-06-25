// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@GetCurrentUser() user: any) {
    return user; // сюда попадает user из JWT payload
  }
}
