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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DefineAttendancePresenceDTO } from '../dto/attendance-is-present.dto';
import { SignAttendanceDTO } from '../dto/sign-attendance.dto';
import { AttendanceTimeSlotGroupAdminGuard } from '../guards/attendance-time-slot-group-admin.guard';
import { UserAssociatedAttendanceGuard } from '../guards/user-associated-attendance.guard';
import { JWTGuard } from '../guards/jwt.guard';
import { TimeSlotGroupAdminGuard } from '../guards/time-slot-group-admin.guard';
import { AttendanceService } from '../services/attendance.service';

@Controller('attendances')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/timeslot/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  createAttendance(@Param('timeSlotId') timeSlotId: string) {
    return this.attendanceService.initTimeSlotAttendances(timeSlotId);
  }

  @Get('/timeslot/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  getAllTimeSlotAttendance(@Param('timeSlotId') timeSlotId: string) {
    return this.attendanceService.getAllTimeSlotAttendances(timeSlotId);
  }

  @Get('/:attendanceId')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  getAttendanceById(@Param('attendanceId') attendanceId: string) {
    return this.attendanceService.getAttendancesById(attendanceId);
  }

  @Patch('/:attendanceId/define-presence')
  @UseGuards(JWTGuard, AttendanceTimeSlotGroupAdminGuard)
  @ApiSecurity('Bearer')
  defineAttendancePresence(
    @Param('attendanceId') attendanceId: string,
    @Body() body: DefineAttendancePresenceDTO,
  ) {
    return this.attendanceService.defineAttendancePresence(attendanceId, body);
  }

  @Patch('/:attendanceId/sign')
  @UseGuards(JWTGuard, UserAssociatedAttendanceGuard)
  @ApiSecurity('Bearer')
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
