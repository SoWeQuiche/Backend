import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { MailDTO } from '../dto/mail.dto';
import { AuthenticationService } from './authentication.service';
import { MailService } from './mail.service';
import { NameDTO } from '../dto/name.dto';
import { Group } from '../models/group.model';
import { Types } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class GroupService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

  createGroup = async (
    organizationId: string,
    parameters: NameDTO,
  ): Promise<Group> => {
    const organization = await this.organizationRepository.findOneById(
      organizationId,
      { hiddenPropertiesToSelect: ['groups'] },
    );

    if (!organization) throw new NotFoundException('Organization not found');

    const group = await this.groupRepository.insert({
      name: parameters.name,
      organization: organization._id,
    });
    if (!group) throw new BadRequestException('Group not created');

    return group;
  };

  getGroupsForOrganization = async (organizationId: string) =>
    this.groupRepository.findManyBy({
      organization: new Types.ObjectId(organizationId),
    });

  listGroupAdmins = async (groupId: string): Promise<User[]> =>
    // @ts-ignore
    this.groupRepository
      .findOneById(groupId, {
        populate: ['admins'],
      })
      .then((organization) => organization.admins);

  listGroupUsers = async (groupId: string): Promise<User[]> =>
    // @ts-ignore
    this.groupRepository
      .findOneById(groupId, {
        populate: ['users'],
      })
      .then((organization) => organization.users);

  deleteGroup = (groupId: string) =>
    this.groupRepository.deleteOnyBy({ _id: groupId });

  promoteUser = async (groupId: string, parameters: MailDTO): Promise<void> => {
    const group = await this.groupRepository.findOneById(groupId, {
      hiddenPropertiesToSelect: ['admins'],
      populate: ['organization'],
    });

    let user = await this.authenticationService.findUserByMail(parameters.mail);

    if (!user) {
      user = await this.authenticationService.registerUser(parameters.mail);
      await this.mailService.sendActivationMail(user, group.organization);
    }

    if (!group.admins.includes(user._id)) {
      group.admins.push(user._id);
      await group.save();
    }
  };

  addUser = async (groupId: string, parameters: MailDTO): Promise<void> => {
    const group = await this.groupRepository.findOneById(groupId, {
      hiddenPropertiesToSelect: ['users'],
    });

    const user = await this.authenticationService.findUserByMail(
      parameters.mail,
    );

    if (!user) throw new BadRequestException('User not found');

    if (!group.users.includes(user._id)) {
      group.users.push(user._id);
      await group.save();
    }
  };
}
