import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ProjectAccessGuard implements CanActivate {
    constructor(private prisma: PrismaService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.sub;
        const projectId = request.params.projectId || request.query.projectId;

        if(!userId || !projectId){
            throw new BadRequestException("Project ID is missing")    
        }

        const member = await this.prisma.member.findUnique({
            where: {
                userId_projectId: {userId, projectId},
            },
        })

        const allowedRoles: UserRole[] = ['OWNER', 'MANAGER'];

        if(!member || !allowedRoles.includes(member.role)){
            throw new ForbiddenException('У вас немає прав керування цим проєктом')
        }
        return true        
    }
}