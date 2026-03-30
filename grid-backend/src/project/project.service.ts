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

    async pickProject(projectId: string){
        return this.prisma.project.findUnique({
            where: { id:projectId }
        })
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

    async membersProject(projectId: string){
        return this.prisma.member.findMany({
            where: {
                projectId: projectId,
            },
            include: {
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })
    }

    async statsProject(projectId: string){
        return this.prisma.project.findUnique({
            where: {id: projectId},
            include: {
                _count:{
                    select:{
                        members: true,
                        sprints: true,
                        tasks: true
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

    async updateProject(projectId: string, dto: CreateProjectDto){
        return this.prisma.project.update({
            where: {id: projectId},
            data:{
                title: dto.title,
                description: dto.description,
                status: dto.status
            }
        })
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
