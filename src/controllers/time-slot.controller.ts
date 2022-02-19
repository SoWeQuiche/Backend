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
import { TimeSlotDTO } from 'src/dto/time-slot.dto';
import { GroupAdminGuard } from 'src/guards/group-admin.guard';
import { JWTGuard } from 'src/guards/jwt.guard';
import { OrganizationAdminGuard } from 'src/guards/organization-admin.guard';
import { TimeSlotService } from 'src/services/time-slot.service';

@Controller('timeslots')
@ApiTags('TimeSlot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post('/group/:groupId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  createTimeSlot(@Param() groupId: string, @Body() body: TimeSlotDTO) {
    return this.timeSlotService.insertTimeSlot(groupId, body);
  }

  @Get('/group/:groupId')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiSecurity('Bearer')
  readAllGroupTimeSlot(@Param('groupId') groupId: string) {
    return this.timeSlotService.getAllGroupTimeSlots(groupId);
  }

  @Get('/:timeSlotId')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiSecurity('Bearer')
  readOneGroupTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.getOneGroupTimeSlotById(timeSlotId);
  }

  @Patch('/group/:groupId/:timeSlotId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  updateOneGroupTimeSlot(
    @Param('groupId') groupId: string,
    @Param('timeSlotId') timeSlotId: string,
    @Body() body: TimeSlotDTO,
  ) {
    return this.timeSlotService.updateOneGroupTimeSlotById(
      {
        groupId,
        timeSlotId,
      },
      {
        ...body,
      },
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
    return this.timeSlotService.getUserTimeSlots(req.user._id);
  }
}
