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
import { PatchingTimeSlotDTO } from 'src/dto/patching-time-slot.dto';
import { TimeSlotDTO } from '../dto/time-slot.dto';
import { GroupOrganizationAdminGuard } from '../guards/group-organization-admin.guard';
import { JWTGuard } from '../guards/jwt.guard';
import { OrganizationAdminGuard } from '../guards/organization-admin.guard';
import { TimeSlotService } from '../services/time-slot.service';

@Controller('timeslots')
@ApiTags('TimeSlot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

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

  @Get('/group/:groupId/:timeSlotId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  readOneGroupTimeSlot(
    @Param('groupId') groupId: string,
    @Param('timeSlotId') timeSlotId: string,
  ) {
    return this.timeSlotService.getOneGroupTimeSlotById(timeSlotId);
  }

  @Patch('/group/:groupId/:timeSlotId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  updateOneGroupTimeSlot(
    @Param('groupId') groupId: string,
    @Param('timeSlotId') timeSlotId: string,
    @Body() body: PatchingTimeSlotDTO,
  ) {
    return this.timeSlotService.updateOneGroupTimeSlotById(
      { timeSlotId },
      { ...body },
    );
  }

  @Delete('/:timeSlotId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  deleteTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.deleteOneGroupTimeSlotById(timeSlotId);
  }

  @Get()
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  getUserTimeSlots(@Req() req) {
    return this.timeSlotService.getUserTimeSlots(req.user);
  }
}
