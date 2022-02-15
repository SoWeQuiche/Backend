import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { CreateOrganizationDTO } from 'src/data-transfer-objects/create-organization.dto';
import { Organization } from 'src/models/organization.model';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  createOrganization = async (
    parameters: CreateOrganizationDTO,
  ): Promise<Organization> => {
    return this.organizationRepository.insert(parameters);
  };
}
