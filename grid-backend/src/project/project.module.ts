import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectGateway } from 'src/gateway/project.gateway';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectGateway],
  exports: [ProjectService]
})
export class ProjectModule {}
