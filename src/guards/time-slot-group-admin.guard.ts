import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class TimeSlotGroupAdminGuard implements CanActivate {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly timeSlotRepository: TimeSlotRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const timeSlot = await this.timeSlotRepository.findOneById(
      request.params.timeSlotId,
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
