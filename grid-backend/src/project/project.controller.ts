import { Controller, Post, Req, Body, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectsService: ProjectService){}

    // Проєкти в яких є користувач
    @Get('my')
    async findAllMyProjects(@CurrentUser('sub') userId: string) {
        return this.projectsService.findAllMyProjects(userId);
    }

    // Всі задачі проєкту
    @Get(':projectId/task')
    async tasksProject(@Param('projectId') projectId: string) {
        return this.projectsService.tasksProject(projectId);
    }

    // Всі учасники проєкту
    @Get(':projectId/members')
    async membersProject(@CurrentUser() user: any, @Param('projectId') projectId: string){
        return this.projectsService.membersProject(projectId);
    }

    // Запит статистики проєкту
    @Get(':projectId/stats')
    async statsProject(@CurrentUser() user: any, @Param('projectId') projectId: string){
        return this.projectsService.statsProject(projectId);
    }

    // Створити проєкт
    @Post()
    async create(@CurrentUser() user: any, @Body() dto: CreateProjectDto){
        return this.projectsService.createProject(user.sub, dto)
    }

    // Видалити проєкт
    @UseGuards(ProjectAccessGuard)
    @Delete(':projectId')
    async deleteProject(@CurrentUser('sub') userId: string, @Param('projectId') projectId: string){
        return this.projectsService.deleteProject(userId, projectId)
    }
}
