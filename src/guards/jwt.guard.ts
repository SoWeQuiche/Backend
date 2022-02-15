import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace(/^Bearer\s/, '');

    try {
      request.user = await this.authenticationService.verifyUserToken(token);

      return true;
    } catch {
      return false;
    }
  }
}
