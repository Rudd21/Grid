import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('sprint/:sprintId/task')
export class SprintTaskController {
    constructor(private readonly taskService: TaskService){}

    @Get()
    async requestTasks(@Param('sprintId') sprintId: string){
        return this.taskService.manyTask(sprintId)
    }

    @UseGuards(ProjectAccessGuard)
    @Post()
    async createTask(
        @Query('projectId') projectId: string,
        @Param('sprintId') sprintId: string,
        @Body() dto: CreateTaskDto
    ){
        return this.taskService.createTask(projectId, sprintId, dto)
    }
}