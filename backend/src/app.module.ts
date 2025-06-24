import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeacherModule } from './teacher/teacher.module';
import { EventModule } from './event/event.module';
import { GroupModule } from './group/group.module';
import { TeacherReviewModule } from './teacher_review/teacher_review.module';
import { TeacherFeedbackModule } from './teacher_feedback/teacher_feedback.module';
import { ParentsModule } from './parents/parents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PreschoolerModule } from './preschooler/preschooler.module';
import { GruopPreschoolerModule } from './gruop_preschooler/gruop_preschooler.module';
import { EventRegestrationModule } from './event_regestration/event_regestration.module';
import { AuthModule } from './auth/auth.module';
import { ParentAndPreschoolModule } from './parent_and_presschooler/parent_and_presschooler.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AdminModule,
    UsersModule,
    PrismaModule,
    TeacherModule,
    EventModule,
    GroupModule,
    TeacherReviewModule,
    TeacherFeedbackModule,
    ParentsModule,
    NotificationsModule,
    ParentAndPreschoolModule,
    AttendanceModule,
    PreschoolerModule,
    GruopPreschoolerModule,
    EventRegestrationModule,
    AuthModule,
    GameModule,
    ChatModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,   
    },
  ],
})
export class AppModule {}
