import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from './service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      console.log(bearer, 'bearer')
      console.log(token, 'token')

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      console.log(token, 'token')

      return this.authClient.send('validate_refresh_token', { token })
        .pipe(
          tap((res) => {
            console.log(res, 'res')
            req.user = res;
            req.refreshToken = token;
          }),
          catchError(() => {
            throw new UnauthorizedException();
          }),
        );
    } catch (e) {
      console.log(e, 'exeption')
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
