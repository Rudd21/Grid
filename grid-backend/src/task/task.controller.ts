import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';

// task.controller.ts — операції з конкретною таскою по taskId
@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @Get(':taskId')
    async requestTask(@Param('taskId') taskId: string){
        return this.taskService.pickTask(taskId)
    }

    @Patch(':taskId/take')
    async takeTask(@CurrentUser('sub') userId: string, @Param('taskId') taskId: string){
        return this.taskService.takeTask(userId, taskId)
    }

    @Delete(':taskId/take')
    async removeTask(@Param('taskId') taskId: string){
        return this.taskService.removeTask(taskId)
    }

    @UseGuards(ProjectAccessGuard)
    @Delete(':taskId')
    async deleteTask(@Param('taskId') taskId: string){
        return this.taskService.deleteTask(taskId)
    }
}

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