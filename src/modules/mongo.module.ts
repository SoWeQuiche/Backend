import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { Organization, OrganizationSchema } from '../models/organization.model';
import { Group, GroupSchema } from '../models/group.model';
import { GroupRepository } from '../repositories/group.repository';
import { File, FileSchema } from '../models/file.model';
import { FileRepository } from '../repositories/file.repository';

@Module({
  imports: [
    NestMongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: File.name, schema: FileSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [
    UserRepository,
    OrganizationRepository,
    GroupRepository,
    FileRepository,
  ],
  exports: [
    UserRepository,
    OrganizationRepository,
    GroupRepository,
    FileRepository,
  ],
})
export class MongoModule {}
