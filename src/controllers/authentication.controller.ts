import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
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
  loginUser(
    @Body() parameters: LoginDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.login(parameters);
  }

  @Post('refresh')
  refreshToken(
    @Body() parameters: RefreshTokenDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authenticationService.refreshToken(parameters);
  }

  @Post('/login/apple-id')
  async appleIdWebhook(@Body() body: SwaDTO): Promise<{ token: string }> {
    return this.authenticationService.loginWithApple(body);
  }

  @Post('activate')
  activateUser(@Body() parameters: ActivationDTO) {
    return this.authenticationService.activateUser(parameters);
  }

  @Get('me')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  me(@Req() request) {
    return request.user;
  }
}
