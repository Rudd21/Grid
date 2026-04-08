import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectGateway } from 'src/gateway/project.gateway';
import { ProjectService } from 'src/project/project.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService,
        private projectService: ProjectService
    ) {}

    async manyTask(sprintId: string) {
        return this.prisma.task.findMany({
            where: {id_sprint: sprintId},
        })
    }

    async pickTask(taskId: string) {
        return this.prisma.task.findUnique({
            where: {id: taskId}
        })
    }

    async updateTask(taskId: string, dto: UpdateTaskDto){
        return this.prisma.task.update({
            where: {id: taskId},
            data:{
                ...dto
            }
        })
    }

    async takeTask(userId: string, taskId: string) {
        const updatedTask = await this.prisma.task.update({
            where: {id: taskId},
            data: {
                taken_at: new Date(),
                id_user: userId
            },
            include: {user: true}
        })

        this.projectService.sendTaskUpdate(updatedTask.id_project, updatedTask)

        return updatedTask
    }

    async removeTask(taskId: string) {
        const updatedTask = await this.prisma.task.update({
            where: {id: taskId},
            data: {
                taken_at: null,
                id_user: null
            },
            include: {user: true}
        })

        this.projectService.sendTaskUpdate(updatedTask.id_project, updatedTask)

        return updatedTask
    }
    
    async createTask(projectId: string, sprintId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                ...dto,
                id_sprint: sprintId,
                id_project: projectId,
            }
        })
    }

    async deleteTask(taskId: string) {
        return this.prisma.task.delete({
            where: {id: taskId}
        })
    }
}
