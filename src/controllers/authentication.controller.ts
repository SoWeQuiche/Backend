import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticationService } from '../services/authentication.service';
import { LoginDTO } from '../dto/login.dto';
import { SwaDTO } from '../dto/swa.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { ActivationDTO } from '../dto/activation.dto';
import { RefreshTokenDTO } from '../dto/refresh-token.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Route for login',
    description: 'Route to login an user and get his tokens.',
  })
  loginUser(
    @Body() parameters: LoginDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.login(parameters);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Route for refresh token',
    description: 'Route for refresh the JWT token of an user.',
  })
  refreshToken(
    @Body() parameters: RefreshTokenDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.refreshToken(parameters);
  }

  @Post('/login/apple-id')
  @ApiOperation({
    summary: 'Enable login by Sign-in with Apple',
    description: 'Login an user by sign-in with Apple and get an JWT token.',
  })
  async appleIdWebhook(@Body() body: SwaDTO): Promise<{ token: string }> {
    return this.authenticationService.loginWithApple(body);
  }

  @Post('activate')
  @ApiOperation({
    summary: 'Activate an user',
    description: 'Activate an user and save it in DB.',
  })
  activateUser(@Body() parameters: ActivationDTO) {
    return this.authenticationService.activateUser(parameters);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get info of the current user',
    description: 'Get user information from his token.',
  })
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  me(@Req() request) {
    return request.user;
  }
}
