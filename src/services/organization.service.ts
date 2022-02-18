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
import { MailService } from './mail.service';
import { AuthenticationService } from './authentication.service';
import { Group } from '../models/group.model';

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

    let user = await this.authenticationService.findUserByMail(parameters.mail);

    if (!user) {
      user = await this.authenticationService.registerUser(parameters.mail);

      await this.mailService.sendActivationMail(user, organization);
    }

    if (!organization.users.includes(user._id)) {
      organization.users.push(user._id);
      await organization.save();
    }
  };

  deleteOrganization = async (organizationId: string) =>
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
      hiddenPropertiesToSelect: ['admins', 'users'],
    });
  };
}
