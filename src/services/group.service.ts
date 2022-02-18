import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { MailDTO } from '../dto/mail.dto';
import { AuthenticationService } from './authentication.service';
import { MailService } from './mail.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

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
