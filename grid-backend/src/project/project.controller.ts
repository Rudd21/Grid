import { Controller, Post, Req, Body, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectsService: ProjectService){}

    @UseGuards(AuthGuard)
    @Get('my')
    async findAllMyProjects(@CurrentUser('sub') userId: string) {
        return this.projectsService.findAllMyProjects(userId);
    }

    @UseGuards(AuthGuard)
    @Get(':projectId/task')
    async tasksProject(@Param('projectId') projectId: string) {
        return this.projectsService.tasksProject(projectId);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@CurrentUser() user: any, @Body() dto: CreateProjectDto){
        return this.projectsService.createProject(user.sub, dto)
    }

    @UseGuards(AuthGuard, ProjectAccessGuard)
    @Delete(':projectId')
    async deleteProject(@CurrentUser('sub') userId: string, @Param('projectId') projectId: string){
        return this.projectsService.deleteProject(userId, projectId)
    }
}
