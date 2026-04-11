import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ProjectModule } from 'src/project/project.module';
import { SprintModule } from 'src/sprint/sprint.module';

@Module({
  imports: [ProjectModule, SprintModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
