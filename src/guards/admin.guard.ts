import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.user.isAdmin;
  }
}
