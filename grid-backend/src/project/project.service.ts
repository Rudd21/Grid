import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService){}

    async findAllMyProjects(userId: string) {
        const memberships = await this.prisma.member.findMany({
            where: {
                userId: userId
            },
            include:{
                project:{
                    include: {
                        _count:{
                            select: {members: true, tasks: true}
                        }
                    }
                },
            },
        });

        return memberships.map((m)=>({
            ...m.project,
            myRole: m.role,
        }));
    }

    async tasksProject(projectId: string) {
        return this.prisma.sprint.findMany({
            where: {
                id_project: projectId
            },
            include: {
                tasks:{
                    select:{
                        id: true,
                        title: true,
                        description: true,
                        difficulty: true,
                        taken_at: true
                    }
                }
            }
        })
    }

    async createProject(userId: string, dto: CreateProjectDto){
        return this.prisma.project.create({
            data: {
                ...dto,
                members: {
                    create: {
                        userId: userId,
                        role: 'OWNER'
                    }
                }
            },
            include:{
                members: true
            }
        });
    }

    async deleteProject(userId: string, projectId: string){
        return this.prisma.project.delete({
            where: {
                id: projectId,
                members: {
                    some: { 
                        userId: userId,
                        role: 'OWNER'
                    }
                }
            }
        })
    }
}
