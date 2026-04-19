import { Controller, Post, Req, Body, UseGuards, Get, Delete, Param, Put, Query } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { UserRole } from '@prisma/client';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectsService: ProjectService){}

    // Глобальний пошук проєктів
    @Get()
    async findAllProjects(@Query('title') title: string) {
        return this.projectsService.findAllProjects(title);
    }

    @UseGuards(AuthGuard)
    // Проєкти в яких є користувач
    @Get('my')
    async findAllMyProjects(@CurrentUser('sub') userId: string) {
        return this.projectsService.findAllMyProjects(userId);
    }

    // Вибрати один проєкт
    @Get(':projectId')
    async pickProject(@Param('projectId') projectId: string){
        return this.projectsService.pickProject(projectId);
    }

    // Всі задачі проєкту
    @Get(':projectId/task')
    async tasksProject(@Param('projectId') projectId: string) {
        return this.projectsService.tasksProject(projectId);
    }

    // Активні задачі
    @Get(':projectId/activeTask')
    async activeTasks(@Param('projectId') projectId: string) {
        return this.projectsService.activeTask(projectId);
    }

    // Всі учасники проєкту
    @Get(':projectId/members')
    async membersProject(@CurrentUser() user: any, @Param('projectId') projectId: string){
        return this.projectsService.membersProject(projectId);
    }

    // Добавити учасника проєкту
    @UseGuards(ProjectAccessGuard)
    @Post(':projectId/members')
    async addMember(@CurrentUser() user: any, @Param('projectId') projectId: string, @Body('email') email: string){
        return this.projectsService.addMember(projectId, email)
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

    // Оновити налаштування проєкту
    @UseGuards(ProjectAccessGuard)
    @Put(':projectId/update')
    async updateProject(@Param('projectId') projectId: string, @Body() dto: CreateProjectDto) {
        return this.projectsService.updateProject(projectId, dto);
    }

    // Видалити проєкт
    @UseGuards(ProjectAccessGuard)
    @Delete(':projectId')
    async deleteProject(@CurrentUser('sub') userId: string, @Param('projectId') projectId: string){
        return this.projectsService.deleteProject(userId, projectId)
    }
}
