import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';

@Injectable()
export class SprintService {
    constructor(private prisma: PrismaService){}

    async requestSprints(projectId: string){
        const sprints = await this.prisma.sprint.findMany({
            where: {id_project: projectId},
            include: {
                tasks: true,
                _count:{
                    select:{
                        tasks: true
                    }
                }
                
            }
        })

        const now = new Date();

        return sprints.map(sprint => {
            const isActive = now >= new Date(sprint.start_date) && now <= new Date(sprint.end_date);
            const deadline = new Date(sprint.end_date);

            // ЗМІНИТИ
            const diffMs = deadline.getTime() - now.getTime()
            const diffDays = Math.ceil(diffMs / (1000*60*60*24))

            return {
                ...sprint,
                isActive,
                deadline: diffDays < 0 ? 0 : diffDays,
            }
        })
    }

    async requestSprint(sprintId: string){
        return this.prisma.sprint.findUnique({
            where: {id: sprintId},
            include:{
                tasks: true
            }
        })
    }

    async createSprint(projectId: string, dto: CreateSprintDto){

        const start = new Date(dto.start_date);
        const end = new Date(dto.end_date)

        if(new Date(dto.start_date) >= new Date(dto.end_date)){
            throw new BadRequestException("Дата завершення має бути не раніше дати початку")
        }

        return this.prisma.sprint.create({
            data: {
                title: dto.title,
                start_date: start,
                end_date: end,
                id_project: projectId
            }
        })
    }

    async deleteSprint(sprintId: string){
        return this.prisma.sprint.delete({
            where: {id: sprintId}
        })
    }
}
