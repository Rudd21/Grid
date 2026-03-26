import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto";

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

    async findAll(){
        return this.prisma.user.findMany();
    }

    async findOneNyEmail(email: string){
        return this.prisma.user.findUnique({
            where: {email}
        })
    }
}