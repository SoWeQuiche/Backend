import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { NameDTO } from 'src/data-transfer-objects/name.dto';
import { Organization } from 'src/models/organization.model';
import { User } from '../models/user.model';
import { MailDTO } from '../data-transfer-objects/mail.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
  ) {}

  createOrganization = async (parameters: NameDTO): Promise<Organization> => {
    return this.organizationRepository.insert(parameters);
  };

  createGroup = async (
    organizationId: string,
    parameters: NameDTO,
  ): Promise<Organization> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['groups'] },
    );

    if (!organization) {
      throw new NotFoundException();
    }

    const group = await this.groupRepository.insert({ name: parameters.name });
    organization.groups.push(group._id);

    return await organization.save();
  };

  promoteUser = async (
    organizationId: string,
    parameters: MailDTO,
  ): Promise<void> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['admins'] },
    );

    const user = await this.userRepository.findOneBy({ mail: parameters.mail });
    organization.admins.push(user._id);
    await organization.save();
  };

  deleteGroup = async (organizationId: string) =>
    this.organizationRepository.deleteOnyBy({ _id: organizationId });

  listManagedOrganizations = async (user: User): Promise<Organization[]> => {
    if (user.isAdmin) {
      return this.organizationRepository.findAll();
    } else {
      return this.organizationRepository.findAll();
    }
  };

  getOrganizationDetails = async (
    organizationId: string,
  ): Promise<Organization> => {
    return this.organizationRepository.findOneById(organizationId, {
      populate: ['groups'],
      hiddenPropertiesToSelect: ['admins', 'users'],
    });
  };
}
