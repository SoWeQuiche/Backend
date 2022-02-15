import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';

@Injectable()
export class OrganizationAdminGuard implements CanActivate {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organization = await this.organizationRepository.findOneById(
      request.params.organizationId,
      { hiddenPropertiesToSelect: ['admins'] },
    );

    if (
      !organization.admins.includes(request.user._id) &&
      !request.user.isAdmin
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
