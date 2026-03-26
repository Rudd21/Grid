import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: any,
        @Res({passthrough: true}) response: Response,
    ){
    const result = await this.authService.signIn(signInDto.email, signInDto.password);
    
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: '/'
    });

    return { message: 'Success' }; 
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() request: any) {
      return request.user;
  }

  @Post('/logout')
  async logout(@Res({passthrough: true}) res: Response){
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(0)
    });

    return { message: "Ви вийшли з системи"}
  }
}
