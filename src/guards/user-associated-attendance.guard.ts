import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { GroupRepository } from '../repositories/group.repository';
import { AttendanceRepository } from '../repositories/attendance.repository';
import mongoose from 'mongoose';

@Injectable()
export class UserAssociatedAttendanceGuard implements CanActivate {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const attendance = await this.attendanceRepository.findOneById(
      request.params.attendanceId,
    );

    if (!attendance) {
      return false;
    }

    // @ts-ignore
    return attendance.user.equals(request.user._id);
  }
}
