import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { ProjectSprintController, SprintController } from './sprint.controller';

@Module({
  providers: [SprintService],
  controllers: [SprintController, ProjectSprintController],
  exports: [SprintService]
})
export class SprintModule {}
