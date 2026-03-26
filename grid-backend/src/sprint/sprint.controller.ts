import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';

@Controller('project/:projectId/sprint')
export class SprintController {
    constructor(private readonly sprintService: SprintService){}

    @UseGuards(AuthGuard)
    @Get()
    async requestSprint(@Param('projectId') projectId: string){
        return this.sprintService.requestSprint(projectId);
    }

    @UseGuards(AuthGuard, ProjectAccessGuard)
    @Post()
    async createSprint(@Param('projectId') projectId: string, @Body() dto: CreateSprintDto){
        return this.sprintService.createSprint(projectId, dto);
    }

    @UseGuards(AuthGuard, ProjectAccessGuard)
    @Delete(':sprintId')
    async deleteSprint(@Param('projectId') projectId: string, @Param('sprintId') sprintId: string){
        return this.sprintService.deleteSprint(sprintId);
    }
}
