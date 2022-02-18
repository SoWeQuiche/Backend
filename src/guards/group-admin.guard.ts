import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { Types } from 'mongoose';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  constructor(private readonly groupRepository: GroupRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const group = await this.groupRepository.findOneBy(
      { _id: request.params.groupId },
      { populate: ['organization'] },
    );

    return !(
      !group.organization ||
      // @ts-ignore
      (!group.organization.admins.includes(request.user._id) &&
        !request.user.isAdmin)
    );
  }
}
