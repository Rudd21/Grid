import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { CreateSprintDto } from './dto/create-sprint.dto';

@UseGuards(AuthGuard)
@Controller('sprint')
export class SprintController {
    constructor(private readonly sprintService: SprintService){}

    @Get(':sprintId')
    async requestSprint(@Param('sprintId') sprintId: string){
        return this.sprintService.requestSprint(sprintId);
    }

    @Patch(':sprintId')
    async updateSprint(@Param('sprintId') sprintId: string, @Body() dto: UpdateSprintDto) {
        return this.sprintService.updateSprint(sprintId, dto)
    }
}


@UseGuards(AuthGuard)
@Controller('project/:projectId/sprint')
export class ProjectSprintController {
    constructor(private readonly sprintService: SprintService){}

    @Get()
    async requestSprints(@Param('projectId') projectId: string){
        return this.sprintService.requestSprints(projectId);
    }

    @UseGuards(ProjectAccessGuard)
    @Post()
    async createSprint(@Param('projectId') projectId: string, @Body() dto: CreateSprintDto){
        return this.sprintService.createSprint(projectId, dto);
    }

    @UseGuards(ProjectAccessGuard)
    @Delete(':sprintId')
    async deleteSprint(@Param('projectId') projectId: string, @Param('sprintId') sprintId: string){
        return this.sprintService.deleteSprint(sprintId);
    }
}
