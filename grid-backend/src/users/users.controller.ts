import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "src/common/guards/auth.guards";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post()
    create(@Body() CreateUserDto: CreateUserDto){
        return this.usersService.create(CreateUserDto);
    }

    @Put()
    updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateUserDto){
        return this.usersService.updateProfile(userId, dto);
    }

    @Patch()
    updatePassword(@CurrentUser('sub') userId: string, @Body() dto: UpdatePasswordDto){
        return this.usersService.updatePassword(userId, dto);
    }

    @Get()
    findAll(@Query('name') name: string){
        return this.usersService.findAll(name);
    }

    @UseGuards(AuthGuard)
    @Get(':userId')
    reqUser(@CurrentUser('sub') userId: string){
        return this.usersService.pickUser(userId)
    }

    @UseGuards(AuthGuard)
    @Get(':userId/profile')
    reqProfile(@CurrentUser('sub') userId: string, @Param('userId') targetUserId: string){
        return this.usersService.crossProject(userId, targetUserId)
    }
}