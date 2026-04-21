import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserRole } from '@prisma/client';
import { ProjectGateway } from 'src/gateway/project.gateway';

@Injectable()
export class ProjectService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(()=> ProjectGateway))
        private readonly projectGateway: ProjectGateway
    ){}


    // Сокет
    sendTaskUpdate(projectId: string, data: any){
        this.projectGateway.notifyTaskUpdate(projectId, data)
    }    

    // Контролери
    async findAllProjects(title: string) {
        return this.prisma.project.findMany({
            where:{
                title
            }
        })
    }

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
            where: { id:projectId },
            include: { 
                members: true
            }
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
                        taken_at: true,
                        status: true,
                        user: true
                    }
                }
            }
        })
    }

    async activeTask(projectId: string) {
        const now = new Date();

        return await this.prisma.sprint.findFirst({
            where:{
                id_project: projectId,
                start_date: {lte: now},
                end_date: {gte: now}
            },
            include:{
                tasks: {
                    select:{
                        id: true,
                        title: true,
                        description: true,
                        difficulty: true,
                        taken_at: true,
                        status: true,
                        user: true
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

    async addMember(projectId: string, email: string, role: UserRole = 'MEMBER'){
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException('Користувача з таким email не знайдено')
        }

        return this.prisma.member.create({
            data:{
                projectId: projectId,
                userId: user.id,
                role: role
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
