import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService{
    constructor(private prisma: PrismaService) {}

    async create(data: CreateUserDto){
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(data.password, salt)

        return this.prisma.user.create({
            data:{
                email: data.email,
                name: data.name,
                password: hashedPassword
            }
        });
    }

    async update(userId: string, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: {id: userId},
            data: {
                
            }
        })
    }

    async findAll(){
        return this.prisma.user.findMany();
    }

    async findOneNyEmail(email: string){
        return this.prisma.user.findUnique({
            where: {email}
        })
    }

    // Спільні проєкти з користувачем
    async crossProject(userId: string, targetUserId: string){
        const [user, crossProjects] = await Promise.all([
            // Профіль користувача
            this.prisma.user.findUnique({
                where: {id: targetUserId},
                select: {id: true, name: true, skills: true}
            }),

            this.prisma.project.findMany({
                where:{
                    members:{
                        some: {userId: userId}
                    },
                    AND:{
                        members:{
                            some: {userId: targetUserId}
                        }
                    }
                },
                select:{id: true, title: true}
            })
        ])

        return {user, crossProjects}
    }
}