import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user.repository';
import { MailDTO } from '../dto/mail.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
  ) {}

  promoteUser = async (groupId: string, parameters: MailDTO): Promise<void> => {
    const group = await this.groupRepository.findOneById(groupId, {
      hiddenPropertiesToSelect: ['admins'],
    });

    const user = await this.userRepository.findOneBy({ mail: parameters.mail });
    if (!user) throw new BadRequestException('User not found');

    if (!group.admins.includes(user._id)) {
      group.admins.push(user._id);
      await group.save();
    }
  };

  addUser = async (groupId: string, parameters: MailDTO): Promise<void> => {
    const group = await this.groupRepository.findOneById(groupId, {
      hiddenPropertiesToSelect: ['users'],
    });

    const user = await this.userRepository.findOneBy({ mail: parameters.mail });
    if (!user) throw new BadRequestException('User not found');

    if (!group.users.includes(user._id)) {
      group.users.push(user._id);
      await group.save();
    }
  };
}
