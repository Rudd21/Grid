import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/common/guards/auth.guards";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post()
    create(@Body() CreateUserDto: CreateUserDto){
        return this.usersService.create(CreateUserDto);
    }

    @Put()
    updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateUserDto){
        return this.usersService.update(userId, dto);
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