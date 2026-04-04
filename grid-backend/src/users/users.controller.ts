import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/common/guards/auth.guards";
import { CurrentUser } from "src/common/decorators/user.decorator";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post()
    create(@Body() CreateUserDto: CreateUserDto){
        return this.usersService.create(CreateUserDto);
    }

    @Patch()
    changeSkills(@CurrentUser('sub') userId: string, @Body() skills: string[]){
        return this.usersService.changeSkills(userId, skills);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(){
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':userId')
    reqProfile(@Param('userId') userId: string){
        return this.usersService.findProfile(userId)
    }
}