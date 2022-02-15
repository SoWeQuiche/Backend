import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { LoginDTO } from '../data-transfer-objects/loginDTO';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() parameters: LoginDTO) {
    return this.authenticationService.login(parameters);
  }
}
