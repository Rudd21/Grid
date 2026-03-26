import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/common/guards/auth.guards";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post()
    create(@Body() CreateUserDto: CreateUserDto ){
        return this.usersService.create(CreateUserDto );
    }

    @UseGuards(AuthGuard)

    @Get()
    findAll(){
        return this.usersService.findAll();
    }
}