import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { NameDTO } from '../dto/name.dto';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { MailDTO } from '../dto/mail.dto';
import { MailService } from './mail.service';
import { AuthenticationService } from './authentication.service';

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

  listOrganizationUsers = async (organizationId: string): Promise<User[]> =>
    // @ts-ignore
    this.organizationRepository
      .findOneById(organizationId, {
        populate: ['users'],
      })
      .then((organization) => organization.users);

  listOrganizationAdmins = async (organizationId: string): Promise<User[]> =>
    // @ts-ignore
    this.organizationRepository
      .findOneById(organizationId, {
        populate: ['admins'],
      })
      .then((organization) => organization.admins);

  promoteUser = async (
    organizationId: string,
    parameters: MailDTO,
  ): Promise<void> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['admins'] },
    );

    if (!organization) {
      throw new NotFoundException();
    }

    let user = await this.authenticationService.findUserByMail(parameters.mail);

    if (!user) {
      user = await this.authenticationService.registerUser(parameters.mail);

      this.mailService.sendActivationMail(user, organization);
    } else {
      this.mailService.sendAddToOrganizationMail(user, organization);
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

    if (!organization) {
      throw new NotFoundException();
    }

    let user = await this.authenticationService.findUserByMail(parameters.mail);

    if (!user) {
      user = await this.authenticationService.registerUser(parameters.mail);

      this.mailService.sendActivationMail(user, organization);
    } else {
      this.mailService.sendAddToOrganizationMail(user, organization);
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

  removeUser = async (
    organizationId: string,
    userId: string,
  ): Promise<void> => {
    await this.groupRepository.Model.updateOne(
      { organization: organizationId },
      { $pull: { users: userId } },
    );

    await this.organizationRepository.Model.updateOne(
      { _id: organizationId },
      { $pull: { users: userId } },
    );
  };

  removeAdmin = async (
    organizationId: string,
    userId: string,
  ): Promise<void> => {
    await this.organizationRepository.Model.updateOne(
      { _id: organizationId },
      { $pull: { admins: userId } },
    );
  };
}
