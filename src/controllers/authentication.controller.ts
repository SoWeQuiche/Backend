import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import axios from 'axios';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterDTO } from '../data-transfer-objects/register.dto';
import { LoginDTO } from '../data-transfer-objects/login.dto';
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

  @Get('apple-id')
  appleIdWebhook(@Body() body) {
    console.log({ body });

    const appleToken = axios.post('https://appleid.apple.com/auth/token', {
      grant_type: 'authorization_code',
      code: body.code,
      redirect_uri: body.redirect_uri,
      client_id: config.swa.serviceId,
      client_secret: this.authenticationService.appleIdClientSecret(),
    });

    return appleToken;
  }

  @Get('apple-id-authorization-url')
  appleIdAuthorizationUrl() {
    const baseUrl = 'https://appleid.apple.com/auth/authorize';

    const params = {
      response_type: 'code id_token',
      response_mode: 'form_post',
      client_id: config.swa.serviceId,
      redirect_uri: 'https://api.sign.quiches.ovh/auth/apple-id',
      // state: '32ba49aa07', // TODO: need generation
      scope: 'name email',
    };

    const searchParams = Object.keys(params)
      .map((key) => {
        return `${key}=${encodeURIComponent(params[key])}`;
      })
      .join('&');

    return `${baseUrl}?${searchParams}`;
  }
}
