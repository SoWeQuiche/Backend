import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterDTO } from '../data-transfer-objects/register.dto';
import { LoginDTO } from '../data-transfer-objects/login.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../models/user.model';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  loginUser(@Body() parameters: LoginDTO): Promise<{ token: string }> {
    return this.authenticationService.login(parameters);
  }

  @Post('register')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  registerUser(@Body() parameters: RegisterDTO): Promise<User> {
    return this.authenticationService.registerUser(parameters);
  }
}
