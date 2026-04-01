import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('sprint/:sprintId/task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @Get()
    async requestTasks(@Param('sprintId') sprintId: string){
        return this.taskService.manyTask(sprintId)
    }

    @Get(':taskId')
    async requestTask(@Param('taskId') taskId: string){
        return this.taskService.pickTask(taskId)
    }

    @Patch(':taskId')
    async takeTask(@CurrentUser('sub') userId: string, @Param('taskId') taskId: string){
        return this.taskService.takeTask(userId, taskId)
    }

    @Delete(':taskId')
    async removeTask(@CurrentUser('sub') userId: string, @Param('taskId') taskId: string){
        return this.taskService.removeTask(taskId)
    }

    @UseGuards(ProjectAccessGuard)
    @Post()
    async createTask(@Query('projectId') projectId: string, @Param('sprintId') sprintId: string, @Body() dto: CreateTaskDto){
        return this.taskService.createTask(projectId, sprintId, dto)
    }

    @UseGuards(ProjectAccessGuard)
    @Delete(':taskId')
    async deleteTask(@Query('projectId') projectId: string, @Param('taskId') taskId: string){
        return this.taskService.deleteTask(taskId);
    }
}
