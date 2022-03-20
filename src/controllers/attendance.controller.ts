import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DefineAttendancePresenceDTO } from '../dto/attendance-is-present.dto';
import { SignAttendanceDTO } from '../dto/sign-attendance.dto';
import { AttendanceTimeSlotGroupAdminGuard } from '../guards/attendance-time-slot-group-admin.guard';
import { UserAssociatedAttendanceGuard } from '../guards/user-associated-attendance.guard';
import { JWTGuard } from '../guards/jwt.guard';
import { TimeSlotGroupAdminGuard } from '../guards/time-slot-group-admin.guard';
import { AttendanceService } from '../services/attendance.service';
import { DefineAttendancePresenceCodeDTO } from '../dto/attendance-is-present-code.dto';
import { DefineAttendancePresenceQrCodeDTO } from '../dto/attendance-is-present-qr-code.dto';

@Controller('attendances')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/timeslot/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Create an attendance',
    description: 'Create an attendance.',
  })
  createAttendance(@Param('timeSlotId') timeSlotId: string) {
    return this.attendanceService.initTimeSlotAttendances(timeSlotId);
  }

  @Get('/timeslot/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get all attendances for a session',
    description: 'Get all attendances for a session.',
  })
  getAllTimeSlotAttendance(@Param('timeSlotId') timeSlotId: string) {
    return this.attendanceService.getAllTimeSlotAttendances(timeSlotId);
  }

  @Get('/:attendanceId')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get an attendance by id',
    description: 'Get an attendance by id.',
  })
  getAttendanceById(@Param('attendanceId') attendanceId: string) {
    return this.attendanceService.getAttendancesById(attendanceId);
  }

  @Patch('/:attendanceId/define-presence')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Set presence for a user',
    description: 'Set presence for a user.',
  })
  defineAttendancePresence(
    @Param('attendanceId') attendanceId: string,
    @Body() body: DefineAttendancePresenceDTO,
  ) {
    return this.attendanceService.defineAttendancePresence(attendanceId, body);
  }

  @Patch('/:attendanceId/define-presence/qr-code')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Set presence for a user by QR Code',
    description: 'Set presence for a user by QR Code.',
  })
  defineAttendancePresenceQrCode(
    @Param('attendanceId') attendanceId: string,
    @Body() body: DefineAttendancePresenceQrCodeDTO,
  ) {
    return this.attendanceService.defineAttendancePresenceQrCode(
      attendanceId,
      body,
    );
  }

  @Patch('/:attendanceId/define-presence/code')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Set presence for a user by Code',
    description: 'Set presence for a user by Code.',
  })
  defineAttendancePresenceCode(
    @Param('attendanceId') attendanceId: string,
    @Body() body: DefineAttendancePresenceCodeDTO,
  ) {
    return this.attendanceService.defineAttendancePresenceCode(
      attendanceId,
      body,
    );
  }

  @Patch('/:attendanceId/sign')
  @UseGuards(JWTGuard, UserAssociatedAttendanceGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Set presence for a user by QR Code',
    description: 'Set presence for a user by QR Code.',
  })
  signAttendance(
    @Param('attendanceId') attendanceId: string,
    @Body() body: SignAttendanceDTO,
    @Req() request,
  ) {
    return this.attendanceService.signAttendance(
      attendanceId,
      request.user._id,
      body,
    );
  }

  @Delete('/:attendanceId')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  deleteAttendanceById(@Param('attendanceId') attendanceId: string) {
    return this.attendanceService.deleteAttendance(attendanceId);
  }
}
