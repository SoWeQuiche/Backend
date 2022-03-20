import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtension,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TimeSlotOrganizationAdminGuard } from '../guards/time-slot-organization-admin.guard';
import { TimeSlotDTO } from '../dto/time-slot.dto';
import { GroupOrganizationAdminGuard } from '../guards/group-organization-admin.guard';
import { JWTGuard } from '../guards/jwt.guard';
import { TimeSlotService } from '../services/time-slot.service';
import { Response } from 'express';

@Controller('timeslots')
@ApiTags('TimeSlot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get('/me')
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get sessions for the current user',
    description: 'Get sessions for the current user.',
  })
  getUserTimeSlots(@Req() req) {
    return this.timeSlotService.getUserTimeSlots(req.user._id);
  }

  @Get('/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get a session',
    description: 'Get a session depending of his ID.',
  })
  readOneGroupTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.getOneGroupTimeSlotById(timeSlotId);
  }

  @Get('/:timeSlotId/signatures-sheet')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Export all signature of a session',
    description: 'Export in a PDF file with all the signature of a session.',
  })
  async getSignaturesSheet(
    @Param('timeSlotId') timeSlotId: string,
    @Res() res: Response,
  ) {
    const filename = `signature-sheet-${timeSlotId}`;
    try {
      const pdfStream = await this.timeSlotService.getSignatureSheet(
        timeSlotId,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}.pdf`,
      );
      pdfStream.pipe(res);
    } catch (err) {
      return new InternalServerErrorException(err);
    }
  }

  @Patch('/:timeSlotId')
  @UseGuards(JWTGuard, TimeSlotOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Update a session',
    description: 'Change session interval.',
  })
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
  @ApiOperation({
    summary: 'Delete a session',
    description: 'Delete a session.',
  })
  deleteTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.timeSlotService.deleteOneGroupTimeSlotById(timeSlotId);
  }

  @Post('/group/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Create a session for a group',
    description: 'Create a session for a group.',
  })
  createTimeSlot(@Param('groupId') groupId: string, @Body() body: TimeSlotDTO) {
    return this.timeSlotService.insertTimeSlot(groupId, body);
  }

  @Get('/group/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get all sessions',
    description: 'Get all sessions a group.',
  })
  readAllGroupTimeSlot(@Param('groupId') groupId: string) {
    return this.timeSlotService.getAllGroupTimeSlots(groupId);
  }
}
