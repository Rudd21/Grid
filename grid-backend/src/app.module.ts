import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProjectModule, SprintModule, TaskModule, NotificationModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
