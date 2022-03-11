import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JWTGuard } from '../guards/jwt.guard';
import { UserDeviceDto } from '../dto/user-device.dto';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/device')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  registerDevice(@Request() req: Request, @Body() linkDto: UserDeviceDto) {
    // @ts-ignore
    const userId = req.user._id;

    return this.notificationService.registerUserDevice(userId, linkDto);
  }

  @Get('/devices')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  getDevices(@Request() req: Request) {
    // @ts-ignore
    const userId = req.user._id;

    return this.notificationService.getUserDevices(userId);
  }

  @Get('/devices/:deviceId')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  getUserDeviceById(
    @Param('deviceId') deviceId: string,
    @Request() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user._id;

    return this.notificationService.getUserDeviceById(userId, deviceId);
  }

  @Delete('/devices/:deviceId')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  deleteUserDeviceById(
    @Param('deviceId') deviceId: string,
    @Request() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user._id;

    return this.notificationService.deleteUserDeviceById(userId, deviceId);
  }
}
