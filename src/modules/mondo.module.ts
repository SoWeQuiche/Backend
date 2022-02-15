import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { OrganizationRepository } from '../repositories/origanization.repository';
import { Organization, OrganizationSchema } from '../models/organization.model';
import { Group, GroupSchema } from '../models/group.model';
import { GroupRepository } from '../repositories/group.repository';

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NestMongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    NestMongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [UserRepository, OrganizationRepository, GroupRepository],
  exports: [UserRepository, OrganizationRepository, GroupRepository],
})
export class MongoModule {}
