import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';
import { SwaDTO } from '../dto/swa.dto';
import { User } from '../models/user.model';
import { JWTGuard } from '../guards/jwt.guard';
import config from '../config';

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

  @Get('me')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  me(@Req() request) {
    return request.user;
  }

  @Post('/login/apple-id')
  async appleIdWebhook(@Body() body: any): Promise<{ token: string }> {
    console.log({ body });
    return this.authenticationService.loginWithApple(body);
  }

  @Get('apple-id-authorization-url')
  appleIdAuthorizationUrl() {
    const baseUrl = 'https://appleid.apple.com/auth/authorize';

    const params = {
      response_type: 'code id_token',
      response_mode: 'form_post',
      client_id: config.swa.serviceId,
      redirect_uri: 'https://api.sign.quiches.ovh/auth/login/apple-id',
      // state: '32ba49aa07', // TODO: need generation
      scope: 'fullname email',
    };

    const searchParams = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    return `${baseUrl}?${searchParams}`;
  }

  @Get('apple-id-secret-token')
  async appleIdSecretToken() {
    return await this.authenticationService.appleIdClientSecret();
  }
}
