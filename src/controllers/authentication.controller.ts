import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { LoginDTO } from '../data-transfer-objects/login.dto';
import { RegisterDTO } from '../data-transfer-objects/register.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  loginUser(@Body() parameters: LoginDTO) {
    return this.authenticationService.login(parameters);
  }

  @Post()
  registerUser(@Body() parameters: RegisterDTO) {
    return this.authenticationService.registerUser(parameters);
  }
}
