import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminModule } from "../admin/admin.module";
import { TeacherModule } from "src/teacher/teacher.module";
import { MailModule } from "src/mail/mail.module";
import { AdminRefreshTokenGuard } from "src/common/guards";
import { JwtAdminStrategy } from "src/common/strategies/jwt.strategy";
import { AdminRefreshTokenCookieStrategy } from "src/common/strategies";
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '15h' },
      }),
      inject: [ConfigService],
    }),
    TeacherModule,
    PrismaModule,
    AdminModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,           
    JwtAuthGuard,          
    JwtAdminStrategy,
    AdminRefreshTokenGuard,
    AdminRefreshTokenCookieStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
