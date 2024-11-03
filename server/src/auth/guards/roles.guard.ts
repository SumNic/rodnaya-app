import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован',
                });
            }

            const checkToken = this.authService.handleValidateUserWithRoles({
                token,
                requiredRoles,
            });
            if (!checkToken) throw new UnauthorizedException();

            this.addUser(checkToken, context);
            return true;
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException();
        }
    }

    private addUser(user: any, request: ExecutionContext) {
        request.switchToHttp().getRequest().user = user;
    }
}
