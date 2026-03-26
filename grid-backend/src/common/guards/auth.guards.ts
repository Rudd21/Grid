import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
            const token = request.cookies?.['access_token'];

            // 1. Перевірка наявності сервісу
            if (!this.jwtService) {
                console.error("JWT Service не інжектовано!");
                return false;
            }

            // 2. Спробуй розкодувати без верифікації
            const decoded = this.jwtService.decode(token);

            try {
                // 3. Спробуй верифікацію з ПРЯМИМ ключем (тим самим, що в модулі)
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env["SUPER_SECRET_KEY"]
                });
                request['user'] = payload;
            } catch (e) {
                throw new UnauthorizedException();
            }
        return true;
    }
}