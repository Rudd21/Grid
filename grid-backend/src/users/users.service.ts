import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

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

    async updateProfile(userId: string, dto: UpdateUserDto){
        return this.prisma.user.update({
            where: {id: userId},
            data: {
                ...dto
            }
        })
    }

    async updatePassword(userId: string, dto: UpdatePasswordDto) {

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        })

        if(!user){
            throw new BadRequestException("Юзер ане знайдено")
        }

        const isMatch = await bcrypt.compare(dto.oldPassword, user?.password)

        if(!isMatch){
            throw new BadRequestException("Невірний старий пароль")
        }

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10)

        return this.prisma.user.update({
            where: {id: userId},
            data: {
                password: hashedPassword
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

    async pickUser(userId: string){
        return this.prisma.user.findUnique({
            where: {id: userId},
            include: {
                tasks: true
            }
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