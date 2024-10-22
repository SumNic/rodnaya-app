import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private readonly tokenService: TokensService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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

            const user = this.tokenService.handleValidateRefreshToken(token);
            req.user = user;
            req.refreshToken = token;
            return true;
        } catch (e) {
            console.log(e, 'exeption');
            throw new UnauthorizedException({
                message: 'Пользователь не авторизован',
            });
        }
    }
}
