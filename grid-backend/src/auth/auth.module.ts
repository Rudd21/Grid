import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../common/guards/auth.guards';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env["SUPER_SECRET_KEY"],
      signOptions: {expiresIn: '1d'},
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
