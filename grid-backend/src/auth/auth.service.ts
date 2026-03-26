import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(email: string, pass: string){
        const user = await this.usersService.findOneNyEmail(email)

        const isMatch = await bcrypt.compare(pass, user?.password || '')

        if(!isMatch){
            throw new UnauthorizedException("Невірний пароль або пошта")
        }

        const payload = {sub:user?.id, email: user?.email}

        return{
            access_token: await this.jwtService.signAsync(payload),
            user: {id: user?.id, email: user?.email, name: user?.name}
        }
    }
}
