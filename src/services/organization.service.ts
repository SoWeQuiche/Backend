import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { NameDTO } from '../dto/name.dto';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { MailDTO } from '../dto/mail.dto';
import { MailService, MailTemplate } from './mail.service';
import { AuthenticationService } from './authentication.service';
import config from '../config';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly mailService: MailService,
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

    if (!organization) throw new NotFoundException('Organization not found');

    const group = await this.groupRepository.insert({ name: parameters.name });
    if (!group) throw new BadRequestException('Group not created');

    if (!organization.groups.includes(group._id)) {
      organization.groups.push(group._id);
      return await organization.save();
    } else return organization;
  };

  promoteUser = async (
    organizationId: string,
    parameters: MailDTO,
  ): Promise<void> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['admins'] },
    );

    let user = await this.authenticationService.findUserByMail(parameters.mail);

    if (!user) {
      user = await this.authenticationService.registerUser(parameters.mail);

      await this.mailService.sendActivationMail(user, organization);
    }

    if (!organization.admins.includes(user._id)) {
      organization.admins.push(user._id);
      await organization.save();
    }
  };

  addUser = async (
    organizationId: string,
    parameters: MailDTO,
  ): Promise<void> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['users'] },
    );

    const user = await this.authenticationService.findUserByMail(
      parameters.mail,
    );
    if (!user) throw new BadRequestException('User not found');

    if (!organization.users.includes(user._id)) {
      organization.users.push(user._id);
      await organization.save();
    }
  };

  deleteGroup = async (organizationId: string) =>
    this.organizationRepository.deleteOnyBy({ _id: organizationId });

  listManagedOrganizations = async (user: User): Promise<Organization[]> => {
    if (user.isAdmin) {
      return this.organizationRepository.findAll();
    } else {
      return this.organizationRepository.findManyBy({
        admins: { $in: [user._id] },
      });
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
