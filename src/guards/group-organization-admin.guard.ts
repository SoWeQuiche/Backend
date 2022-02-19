import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupOrganizationAdminGuard implements CanActivate {
  constructor(private readonly groupRepository: GroupRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const group = await this.groupRepository.findOneBy(
      { _id: request.params.groupId },
      { populate: ['organization'] },
    );

    return !(
      !group.organization ||
      (!group.organization.admins.includes(request.user._id) &&
        !request.user.isAdmin)
    );
  }
}
