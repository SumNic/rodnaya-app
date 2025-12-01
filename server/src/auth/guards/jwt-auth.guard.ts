import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован',
                });
            }

            const user = await this.authService.handleValidateUser(token);
            req.user = user;
            return true;
        } catch (e) {
            console.log(e, 'e canActivate');
            throw new UnauthorizedException({
                message: 'Пользователь не авторизован',
            });
        }
    }
}
