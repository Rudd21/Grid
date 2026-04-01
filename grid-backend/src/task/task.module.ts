import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ProjectService } from 'src/project/project.service';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
