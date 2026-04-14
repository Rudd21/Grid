import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ProjectModule } from 'src/project/project.module';
import { SprintModule } from 'src/sprint/sprint.module';
import { SprintTaskController } from './sprint-task.controller';

@Module({
  imports: [ProjectModule, SprintModule],
  controllers: [TaskController, SprintTaskController],
  providers: [TaskService]
})
export class TaskModule {}
