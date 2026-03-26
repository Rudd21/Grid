import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

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

    async takeTask(userId: string, taskId: string) {
        return this.prisma.task.update({
            where: {id: taskId},
            data: {
                taken_at: new Date(),
                id_user: userId
            }
        })
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
