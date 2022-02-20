import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { GroupRepository } from '../repositories/group.repository';
import { AttendanceRepository } from 'src/repositories/attendance.repository';

@Injectable()
export class AttendanceTimeSlotGroupAdminGuard implements CanActivate {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const attendance = await this.attendanceRepository.findOneById(
      request.params.attendanceId,
    );

    const timeSlot = await this.timeSlotRepository.findOneById(
      // @ts-ignore
      attendance.timeSlot,
    );

    if (!timeSlot) {
      return false;
    }

    const group = await this.groupRepository.findOneBy(
      { _id: timeSlot.group },
      { populate: ['organization'], hiddenPropertiesToSelect: ['admins'] },
    );

    if (!group || !group.organization) {
      return false;
    }

    if (
      !group.admins.includes(request.user._id) &&
      !group.organization.admins.includes(request.user._id) &&
      !request.user.isAdmin
    ) {
      return false;
    }

    return true;
  }
}
