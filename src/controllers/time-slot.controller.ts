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
import { TimeSlotOrganizationAdminGuard } from '../guards/time-slot-organization-admin.guard';
import { TimeSlotDTO } from '../dto/time-slot.dto';
import { GroupOrganizationAdminGuard } from '../guards/group-organization-admin.guard';
import { JWTGuard } from '../guards/jwt.guard';
import { TimeSlotService } from '../services/time-slot.service';

@Controller('timeslots')
@ApiTags('TimeSlot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get()
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  getUserTimeSlots(@Req() req) {
    return this.timeSlotService.getUserTimeSlots(req.user._id);
  }

  @Get('/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  readOneGroupTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.getOneGroupTimeSlotById(timeSlotId);
  }

  @Patch('/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  updateOneGroupTimeSlot(
    @Param('timeSlotId') timeSlotId: string,
    @Body() body: TimeSlotDTO,
  ) {
    return this.timeSlotService.updateOneGroupTimeSlotById(timeSlotId, {
      ...body,
    });
  }

  @Delete('/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  deleteTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.deleteOneGroupTimeSlotById(timeSlotId);
  }

  @Post('/group/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  createTimeSlot(@Param('groupId') groupId: string, @Body() body: TimeSlotDTO) {
    return this.timeSlotService.insertTimeSlot(groupId, body);
  }

  @Get('/group/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  readAllGroupTimeSlot(@Param('groupId') groupId: string) {
    return this.timeSlotService.getAllGroupTimeSlots(groupId);
  }
}
